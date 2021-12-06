/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const path = require('path');
const { CLASS_ID, ASSIGNMENT_ID } = require('../config/vars');
const log = require('../config/logger');
const teams = require('../services/httpClient');
const Submission = require('../api/models/submission.model');

// Job runs every minute
const job = new CronJob('0 */1 * * * *', async () => {
  try {
    log.info('Checking for assignments...');

    const {
      data: { value: assignments },
    } = await teams.get(
      `/education/classes/${CLASS_ID}/assignments/${ASSIGNMENT_ID}/submissions`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const submission of assignments) {
      const { data: student } = await teams.get(
        `users/${submission.recipient.userId}`
      );
      const submissionInDb = await Submission.findOne({
        submissionId: submission.id,
        studentId: student.id,
      });
      if (submissionInDb) continue;

      const {
        data: { value: sub },
      } = await teams.get(
        `/education/classes/${CLASS_ID}/assignments/${ASSIGNMENT_ID}/submissions/${submission.id}/submittedResources`
      );

      const { data: subResource } = await teams.get(
        sub[0].resource.fileUrl.split('https://graph.microsoft.com/v1.0')[1]
      );

      const saved = await teams.downloadFile(
        subResource['@microsoft.graph.downloadUrl'],
        path.join(__dirname, `../../submissions/${student.id}.sql`)
      );

      if (!saved) return log.error('Unable to process file');

      const newSub = new Submission({
        submissionId: submission.id,
        assignmentId: ASSIGNMENT_ID,
        studentId: student.id,
        name: student.displayName,
      });

      await newSub.save();
    }
  } catch (error) {
    console.error(error);
  }

  return 1;
});

job.start();
