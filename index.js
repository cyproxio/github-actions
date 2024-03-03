const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
    const workspace = process.env.GITHUB_WORKSPACE;
    const currentRunnerID = process.env.GITHUB_RUN_ID;
    try {
        await exec.exec(`docker pull cyprox/scan-agent:latest -q`);
        try {
            core.setSecret(core.getInput('api_key'))
            await exec.exec(`docker run -v ${workspace}:/output:rw cyprox/scan-agent --api-key=${core.getInput('api_key')} ${core.getInput('api_url') ? ('--api-url='+core.getInput('api_url')) : ''} --scan-id=${core.getInput('scan_id')} --tag-name=${core.getInput('tag_name') ? core.getInput('tag_name') : ('github-action-'+currentRunnerID)} --o=true`);
        } catch (err) {
            core.setFailed(err.message);
        }
        console.log(`Scanning process completed, starting to analyze the results`);
        const jOutputFile = fs.readFileSync(`${workspace}/output.json`);
        const currentOutput = JSON.parse(jOutputFile.toString());
        if(currentOutput['success']) {
            if(currentOutput['founded'] > 0) {
                const failAction = core.getInput('fail_action');
                warnMsg = `Scan action failed as Cyprox has identified ${currentOutput['founded']} alerts, starting to analyze the results`;
                if(String(failAction).toLowerCase() === 'true') {
                    core.setFailed(warnMsg);
                } else {
                    core.warning(warnMsg);
                }
            }
        } else {
            core.setFailed(`Scan action failed: ${currentOutput['msg']}`);
        }
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
