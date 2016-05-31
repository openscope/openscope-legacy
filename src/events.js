
class Events {

  constructor() {
    this.events = {};
  }

  on(ev, callback) {
    this.events[ev] = this.events[ev] || [];
    
    this.events[ev].push(callback);
  }

  off(ev, callback) {
    this.events[ev] = this.events[ev] || [];
    
    var index = this.events[ev].indexOf(callback);

    if(index >= 0) this.events[ev].splice(index, 1);
  }

  fire(ev, data) {
    this.events[ev] = this.events[ev] || [];
    
    for(var i=0; i<this.events[ev].length; i++) {
      this.events[ev][i](data);
    }
    
  }

}

exports.Events = Events;
