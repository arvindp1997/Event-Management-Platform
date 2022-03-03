const express = require("express");
const router = express.Router();
const Event = require("../models/event");

//Getting upcoming events
router.get("/upcoming", async (req, res) => {
  try {
    const events = await Event.find();
    //console.log(events[0].eventStartTime);
    // console.log(new Date());
    let futureEvent = [];

    for (let i = 0; i < events.length; i++) {
      if (events[i].eventStartTime > new Date()) futureEvent.push(events[i]);
    }
    res.json(futureEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Getting live events - events will be live before 10mins of start time
router.get("/live", async (req, res) => {
  try {
    const events = await Event.find();
    let liveEvent = [];
    console.log(new Date());
    for (let i = 0; i < events.length; i++) {
      let timeDiff = events[i].eventStartTime - new Date();

      var minutes = Math.floor(timeDiff / 60000);
     // console.log(minutes);

      if (timeDiff <= 0 && Math.abs(minutes) <= 10) liveEvent.push(events[i]);
    }
    res.json(liveEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Getting One event
router.get("/:id", getEvent, (req, res) => {
  res.json(res.event1);
});
//Creating One event
router.post("/", async (req, res) => {
  const event = new Event({
    eventName: req.body.eventName,
    eventStartTime: req.body.eventStartTime,
    eventDuration: req.body.eventDuration,
    singleEvent: req.body.singleEvent,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One event
router.patch("/:id", getEvent, async (req, res) => {
  if (req.body.eventName != null) {
    res.event1.eventName = req.body.eventName;
  }
  if (req.body.eventDuration != null) {
    res.event1.eventDuration = req.body.eventDuration;
  }
  if (req.body.eventStartTime != null) {
    res.event1.eventStartTime = req.body.eventStartTime;
  }

  // if(res.body.singleEvent != null){
  //   res.event1.singleEvent = req.body.singleEvent
  // }

  try {
    const updatedEvent = await res.event1.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Deleting One event
router.delete("/:id", getEvent, async (req, res) => {
  try {
    await res.event1.remove();
    res.json({ message: "Deleted event" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEvent(req, res, next) {
  let event1;
  try {
    event1 = await Event.findById(req.params.id);

    if (event1 == null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.event1 = event1;

  next();
}

module.exports = router;
