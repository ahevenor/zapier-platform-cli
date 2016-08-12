const _ = require('lodash');

const utils = require('../utils');

const makeAccess = (command, recordType) => {
  const recordTypePlural = `${recordType}s`;

  const access = (context, email) => {
    if (email) {
      return utils.checkCredentials()
        .then(() => utils.getLinkedApp())
        .then((app) => {
          var url = `/apps/${app.id}/${recordTypePlural}/${email}`;
          if (global.argOpts.remove) {
            context.line(`Preparing to remove ${recordType} ${email} from your app "${app.title}".\n`);
            utils.printStarting(`Removing ${email}`);
            return utils.callAPI(url, {method: 'DELETE'});
          } else {
            context.line(`Preparing to add ${recordType} ${email} to your app "${app.title}".\n`);
            utils.printStarting(`Adding ${email}`);
            return utils.callAPI(url, {method: 'POST'});
          }
        })
        .then(() => {
          utils.printDone();
          context.line(`\n${_.capitalize(recordTypePlural)} updated! Try viewing them with \`zapier ${command}\`.`);
        });
    } else {
      return utils.listEndoint(recordTypePlural)
        .then((data) => {
          context.line(`The ${recordTypePlural} on your app "${data.app.title}" listed below.\n`);
          const ifEmpty = `${_.capitalize(recordTypePlural)} not found. Try adding one with \`zapier ${command} user@example.com\`.`;
          utils.printData(data[recordTypePlural], [
            ['Email', 'email'],
            ['Role', 'role'],
            ['Status', 'status'],
          ], ifEmpty);
        });
    }
  };
  access.argSpec = [
    {name: 'email', example: 'john@example.com'},
  ];
  access.argOptsSpec = {
    remove: {}
  };

  return access;
};

module.exports = makeAccess;
