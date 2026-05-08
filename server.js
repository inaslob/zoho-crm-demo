const express = require("express");
const cors = require("cors");
const https = require("https");

const app = express();

app.use(cors());
app.use(express.static("public"));

const PORT = 3000;

const ZOHO_TOKEN = process.env.API_KEY;

app.get("/implementation-projects", function(req, res) {

    const status = req.query.status;

    let path = "/crm/v2/Implementation_Projects";

    if (status) {
        path =
            "/crm/v2/Implementation_Projects/search?criteria=(Status:equals:" +
            encodeURIComponent(status) +
            ")";
    }
    
    const options = {
        hostname: "www.zohoapis.com",
        path: path,
        method: "GET",
        headers: {
            Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN
        }
    };

    const zohoReq = https.request(options, function(zohoRes) {

        let data = "";

        zohoRes.on("data", function(chunk) {
            data += chunk;
        });

        zohoRes.on("end", function() {
            try {
                const jsonData = JSON.parse(data);
                
                // Zoho returns no data for search
                if (jsonData.code === "NO_CONTENT" ||
                    jsonData.data === undefined) {
                    return res.json({
                        data: []
                    });
                }
                
                res.json(jsonData);
                
            } catch (error) {
                res.json({
                    data: []
                });
            }
        });
    });

  zohoReq.on("error", function(error) {
    console.log(error);
    res.status(500).send("Request failed");
  });

  zohoReq.end();
});

app.get("/timesheets/:projectId", function(req, res) {

  const projectId = req.params.projectId;

  const path =
    "/crm/v2/Timesheets/search?criteria=(Project:equals:" +
    projectId +
    ")";

  const options = {
    hostname: "www.zohoapis.com",
    path: path,
    method: "GET",
    headers: {
      Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN
    }
  };

  const zohoReq = https.request(options, function(zohoRes) {

    let data = "";

    zohoRes.on("data", function(chunk) {
      data += chunk;
    });

    zohoRes.on("end", function() {

      try {

        const jsonData = JSON.parse(data);

        if (
          jsonData.code === "NO_CONTENT" ||
          jsonData.data === undefined
        ) {
          return res.json({
            data: []
          });
        }

        res.json(jsonData);

      } catch (error) {

        res.json({
          data: []
        });
      }
    });
  });

  zohoReq.on("error", function(error) {

    console.log(error);

    res.status(500).send("Request failed");
  });

  zohoReq.end();
});

app.get("/accounts", function(req, res) {

  const options = {
    hostname: "www.zohoapis.com",
    path: "/crm/v2/Accounts",
    method: "GET",
    headers: {
      Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN
    }
  };

  const zohoReq = https.request(options, function(zohoRes) {

    let data = "";

    zohoRes.on("data", function(chunk) {
      data += chunk;
    });

    zohoRes.on("end", function() {
      res.send(data);
    });
  });

  zohoReq.end();
});

app.get("/contacts", function(req, res) {

  const options = {
    hostname: "www.zohoapis.com",
    path: "/crm/v2/Contacts",
    method: "GET",
    headers: {
      Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN
    }
  };

  const zohoReq = https.request(options, function(zohoRes) {

    let data = "";

    zohoRes.on("data", function(chunk) {
      data += chunk;
    });

    zohoRes.on("end", function() {
      res.send(data);
    });
  });

  zohoReq.end();
});

app.get("/create-project", function(req, res) {
    
    const name = req.query.name;
    const accountId = req.query.accountId;
    const contactId = req.query.contactId;
    const budget = req.query.budget;
    
    const postData = JSON.stringify({
        data: [
            
            {
                Name: name,
                Budget: budget,
                Status: "Draft",
                Account: {
                    id: accountId
                },
                Contact: {
                    id: contactId
                }
            }
        ]
    });
    
    const options = {
    hostname: "www.zohoapis.com",
    path: "/crm/v2/Implementation_Projects",
    method: "POST",
    headers: {
      Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  const zohoReq = https.request(options, function(zohoRes) {

    let data = "";

    zohoRes.on("data", function(chunk) {
      data += chunk;
    });

    zohoRes.on("end", function() {
      res.send(data);
    });
  });

  zohoReq.write(postData);

  zohoReq.end();
});

app.get("/create-timesheet", function(req, res) {

  const projectId = req.query.projectId;
  const hours = req.query.hours;
  const description = req.query.description;
  const billable = req.query.billable;

  const today = new Date().toISOString().split("T")[0];

  const postData = JSON.stringify({
    data: [
      {
        Project: {
          id: projectId
        },
        Date: today,
        Hours: hours,
        Description: description,
        Billable: billable === "true"
      }
    ]
  });

  const options = {
    hostname: "www.zohoapis.com",
    path: "/crm/v2/Timesheets",
    method: "POST",
    headers: {
      Authorization: "Zoho-oauthtoken " + ZOHO_TOKEN,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  const zohoReq = https.request(options, function(zohoRes) {

    let data = "";

    zohoRes.on("data", function(chunk) {
      data += chunk;
    });

    zohoRes.on("end", function() {
      res.send(data);
    });
  });

  zohoReq.on("error", function(error) {

    console.log(error);

    res.status(500).send("Request failed");
  });

  zohoReq.write(postData);

  zohoReq.end();
});


app.listen(PORT, function() {
  console.log("Server running on http://localhost:3000");
});

