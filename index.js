var y=0;

const TBA_Auth = "kFjEvA5nZnwGMKaS9o3gR9pwNDvD2HcEktI8kOUzxb5jqbe2seobw1Iyeot7Vi2e"

var app = new Vue({
  el: "#js-is-dumb",
  data: {
    my_team_number: "1719",
    teams: [],
    logs: [],
    show_logs: false,
    last_modified: "...",
    year: (y=localStorage.getItem("1719_Year")) == null ? 2010 : y,
    events: [],
    visible_events: [],
    selected_index: 2,
    event_name_filter: ""
  },
  computed: {
    logger_status: function () {
      return this.show_logs ? "Logger:".bold() : "Click to reveal logger"
    },
  },
  methods: {
      loggerToggle: function () {
          log(app, "Logger Toggled, " + app.show_logs)
          app.show_logs = !app.show_logs
      },
      refreshEvents: function () {
        fetch("https://www.thebluealliance.com/api/v3/events/" + this.year, {
          headers: {
            "X-TBA-Auth-Key": TBA_Auth
          }
        }).then(function(resp) {
          app.last_modified = resp.headers.get("Last-Modified")
          resp.json().then(function (resp) {
            app.events = []
            for (let index = 0; index < resp.length; index++) {
              const element = resp[index];
              app.events.push(element)
            }
          })
        }).catch(function(reason) {
          log(app, "ERROR: " + reason)
        })
      },
      refreshTeams: function () {
        console.log(this.events)
        fetch("https://www.thebluealliance.com/api/v3/event/" + this.visible_events[this.selected_index].key + "/teams/simple", {
          headers: {
            "X-TBA-Auth-Key": TBA_Auth
          }
        }).then(function(resp) {
          resp.json().then(function (resp) {
            app.teams = []
            for (let index = 0; index < resp.length; index++) {
              const element = resp[index];
              app.teams.push(element)
            }
          })
        }).catch(function(reason) {
          log(app, "ERROR: " + reason)
        })
      },
      onTeamClick: function (event) {
        console.log(JSON.stringify(event))
        
        localStorage.setItem("1719_Team", JSON.stringify(event))
        localStorage.setItem("1719_SelectedEvent", JSON.stringify(this.visible_events[this.selected_index]))

        window.location = "teamdata"
      },
      refresh: function () {
        log(this, "Refreshing...")
        
        this.refreshEvents()
        this.refreshTeams()
      },
      eventClick: function (event) {
        var index=event.currentTarget.getAttribute('data-event')
        app.selected_index = index
        log(app, "Selected event #" + app.selected_index + ", " + app.events[index].name)
        this.refreshEvents()
      }
  },
  watch: {
    year: function (new_value) {
      localStorage.setItem("1719_Year", new_value)
      this.refreshEvents()
    },
    event_name_filter: function (new_value) {
      console.log("watch")
      let found_events = []
      this.event_name_filter = new_value

      this.events.forEach(element => {
        if (element.name.toUpperCase().includes(app.event_name_filter.trim().toUpperCase())) {
          found_events.push(element)
        }
      })

      this.visible_events = found_events
    }
  },
  mounted: function() {
      log(this, "Mounted")
      this.refresh()
  }
});

// Log helper
function log(v_app, msg) {
  v_app.logs.push(new Date().toLocaleString().bold() + ": " + msg + "<br>") 
}