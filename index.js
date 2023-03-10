const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    const failAction = core.getInput('fail_action');
    const options = {};
    let output = [];
    let error = [];
    options.listeners = {
      stdout: (data) => {
      output = output.concat(String(data).split('\n'));
      },
      stderr: (data) => {
        error.push(String(data).split('\n'));
      },
    };
    try {
        await exec.exec(`docker pull cyprox/scan-engine:latest -q`);
        try {
            core.setSecret(core.getInput('api_key'))
            await exec.exec(`docker run cyprox/scan-engine --api-key=${core.getInput('api_key')} --scan-id=${core.getInput('scan_id')} ${core.getInput('tag_name') ? ('--tag-name='+core.getInput('tag_name')) : ''}`,"",options);
        } catch (err) {
            core.setFailed(err.message);
        }
        var result = getPatternValue(output, resultPatrn)
        if(result && result.includes('SUCCESS')) {
            console.log(`Scanning process completed, starting to analyze the results. visit: https://app.cyprox.io`);
            var countStr = getPatternValue(output, findingPatrn);
            var count = parseInt(isNaN(countStr) ? -1 : countStr);
            if(count > 0){
                warnMsg = `Scan action failed as Cyprox has identified ${count} alerts, starting to analyze the results. visit: https://app.cyprox.io`;
                if(String(failAction).toLowerCase() === 'true') {
                    core.setFailed(warnMsg);
                } else {
                    core.warning(warnMsg);
                }
            }
        } else {
            var msgOut = getPatternValue(output, messagePatrn);
            core.setFailed(`Scan action failed: ${msgOut ? msgOut : error}`);
        }
    } catch (err) {
        core.setFailed(err.message);
    }
}

resultPatrn = 'Result      :';
messagePatrn = 'Message     :';
findingPatrn = 'Total Findings    :';

function getPatternValue(arr, pattern){
    foundedLine = arr.find(line => line && line.includes(pattern));
    if(foundedLine) {
        return String(foundedLine).replace(pattern,'').trim()
    } 
    return null;
}

run();
