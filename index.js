const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
    const workspace = process.env.GITHUB_WORKSPACE;
    const currentRunnerID = process.env.GITHUB_RUN_ID;
    try {
        await exec.exec(`docker pull cyprox/scan-engine:latest -q`);
        try {
            core.setSecret(core.getInput('api_key'))
            await exec.exec(`docker run -v ${workspace}:/:rw cyprox/scan-engine --api-key=${core.getInput('api_key')} ${core.getInput('api_url') ? ('--api-url='+core.getInput('api_url')) : ''} --scan-id=${core.getInput('scan_id')} --tag-name=${core.getInput('tag_name') ? core.getInput('tag_name') : ('github-action-'+currentRunnerID)} --o=true`);
        } catch (err) {
            core.setFailed(err.message);
        }
        const failAction = core.getInput('fail_action');
        const jOutputFile = fs.readFileSync(`${workspace}/output.json`);
        const currentOutput = JSON.parse(jOutputFile.toString());
        console.log(currentOutput);
        core.setFailed(currentOutput['msg']);
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
