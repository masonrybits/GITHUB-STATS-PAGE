'use strict';

const superagent = require('superagent');

const issue = require('./issues');
const pr = require('./pullRequests');

//Create an array of all members in an org
function allMembers (request, response) {

  let orgName = 'C-T-R-L-Z';
  let url = `https://api.github.com/orgs/c-t-r-l-z/members`;

  superagent.get(url)
    .set('User-Agent', 'C-T-R-L-Z')
    .auth (process.env.username, process.env.password)
    .then (results => {
      let org = new OrgData(orgName);

      results.body.forEach(member => {
        org.members.push(new Member(member.login));
      });

      let fillData = [pr(org), issue(org)];

      Promise.all(fillData).then(() => {
        response.send(org);
      });
    });
}

function Member (name) {
  this.name = name;
  this.pulls = 0;
  this.reviews = 0;
  this.openIssues = 0;
  this.assignedIssues = 0;
  this.merge = 0;
}

function OrgData(name) {
  this.name = name;
  this.members = [];
  this.totalPulls = 0;
  this.reviews = 0;
  this.issues = 0;
  this.issuesAssigned = 0;
  this.merge = 0;
}

module.exports = allMembers;
