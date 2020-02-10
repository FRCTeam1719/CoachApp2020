const SPREASHEET_DEPLOY = "https://script.google.com/a/parkschool.net/macros/s/AKfycbyM08aGgNXSMdgdpXz7wdJsXhz4NKVtuu_EHGueew/exec"

var app = new Vue({
  el: "#teamdata-app",
  data: {
    team: [],
    event: [],
    scouting_data: [],
    loading_message: "Loading...".bold(),
  },
  computed: {
    sponsors: function () {
        return this.team.name.match(/[^\/&]+/g)
    }
  },
  methods: {
  },
  watch: {
  },
  mounted: function() {
      this.team = JSON.parse(localStorage.getItem("1719_Team"))
      this.event = JSON.parse(localStorage.getItem("1719_SelectedEvent"))

      document.title.replace("...", this.team.team_number)

      fetch(SPREASHEET_DEPLOY + "?teamnumber=" + this.team.team_number).then(function(resp) {
        if (resp.status != "200") {
          console.log("Failed to connect.")
          return
        }
        resp.json().then(function (resp2) {
          if (resp2.status != "200") {
            console.error("Error: status code " + resp2.status)
          } else {
            let team_number_search = app.team.team_number
            let found_team = false

            console.log("Looking for team number: ", team_number_search)
            resp2.messages.slice(1).forEach(row => {
              if (row[0] == team_number_search) {
                for (let i = 0; i < row.length; i++) {
                  const column = row[i];
                  
                  app.scouting_data.push([resp2.messages[0][i].trim(), column])
                }
                console.log("Found scouting data: ", app.scouting_data)
                found_team = true
              }
            });

            if (!found_team) {
              app.loading_message = "<b style=\"color:red;\">No data on team found.</b>"
            }
          }
        })
      }).catch(function(reason) {
          console.log(app, reason)
      })

      console.log(this.team, this.event)

      fetch("https://www.thebluealliance.com/api/v3/team/" + this.team.key + "/event/" + this.event.key)
  }
})