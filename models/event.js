const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // i. Event Name
  //ii. Event Starting time
  //iii. Event duration
  //iv. A single event, has a single Starting time and duration

  eventName: {
    type: String,
    required: true,
  },
  eventStartTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  eventDuration: {
    type: Number,
    required: true,
  },
  singleEvent: {
    type: Object,
    eventStartTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    eventDuration: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("Event", eventSchema);
