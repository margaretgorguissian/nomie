import Log from "../../../src/modules/nomie-log/nomie-log";
import math from "../../../src/utils/math/math";

describe("modules/nomie-log", function () {
  let log;
  let stub = {
    note: `I'm a note for #testing and I'm #good(344) and #good and kinda #bad sometimes #bad and @brandon is now here +testing context and +more.
		 I bet @betty would have dug Nomie, she was my grandmother. #cheese(50) +love
		`,
  };

  it("should try and find a timezone if not provided one and has lat long", () => {
    let log = new Log({
      lat: 39.764,
      lng: -86.1581,
      note: "Testing Location Indy",
    });
    let logSoule = new Log({
      lat: 39.764,
      lng: 126.978,
      note: "Testing Location Soule",
    });
    expect(log.offset).to.equal(240);
    expect(logSoule.offset).to.equal(-540);
  });

  it("should handle the speed", () => {
    let start = new Date().getTime();
    let items = [];
    for (var i = 0; i < 100000; i++) {
      let log = new Log({
        lat: 39.764,
        lng: 126.978,
        note: "Testing Location Soule",
      });
      items.push(log);
    }
    let end = new Date().getTime() - start;
    console.log(`${items.length} took ${end}ms`);
  });

  it("log.getMeta", () => {
    log = new Log(stub);
    const meta = log.getMeta();

    expect(meta.people[0].id).to.equal("brandon");
    expect(meta.people[1].id).to.equal("betty");
    expect(meta.context[0].id).to.equal("testing");
    expect(meta.context[1].id).to.equal("more");
    expect(meta.context[2].id).to.equal("love");
    expect(meta.trackers[0].id).to.equal("testing");
  });

  it("log initializes", () => {
    log = new Log(stub);
    expect(log).to.be.instanceOf(Log);
    // expect(log.note).to.equal(stub.note);
  });

  it("should scrub the note", () => {
    log = new Log({
      note: "Hello #there @brandon",
    });
    let scrubbed = log.getScrubbedNote();
    expect(scrubbed).to.equal("Hello @brandon");
  });

  it("should scrub the note", () => {
    log = new Log({
      note: "Hello #there #there(40) #there(30) @brandon",
    });
    let value = log.getTrackerValue("there");
    expect(value).to.equal(71);
  });

  it("log.toObject", () => {
    log = new Log(stub);
    expect(log.toObject()._id).to.be.a("string");
  });
  it("log.expanded", () => {
    log = new Log(stub);
    log.getMeta();
    expect(log.trackers.length).to.equal(6);
  });
  it("log.hasTracker", () => {
    log = new Log(stub);
    log.getMeta();
    expect(log.hasTracker("testing")).to.equal(true);
    expect(log.hasTracker("nothing")).to.equal(false);
  });

  it("log.addTag", () => {
    log = new Log(stub);
    log.expanded();
    log.addTag("cheese", 50);
    expect(log.hasTracker("cheese")).to.equal(true);
    expect(math.sum(log.getTrackerValues("cheese"))).to.equal(100);
  });
});
