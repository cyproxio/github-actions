## Overview
New generation cyber attacks are expoloited via legal HTTP requests! Just changing a parameter value can't be avoid by the application. It's totally legal and valid HTTP request to be executed from the frontend and the backend server.

Optimized scanning features, you will be able to manage your scheduled API endpoint scans, import your documentation files, and perform scanning against specific vulnerabilities.

## Getting started with Cyprox API Scan action
### Understanding the inputs

| **Input**           | **Description**                                                                        |
| ------------------- |----------------------------------------------------------------------------------------|
| api_key             | provided API key from platform                                                         |
| scan_id             | scan policy ID                                                                         |
| tag_name            | tag ```-optional```                                                                    |
| fail_action         | action status will be set to fail if Cyprox any alerts during the scan  ```-optional```|

### Sample GitHub Action workflow
```
on: [push]
jobs:
  api_scan:
    runs-on: ubuntu-latest
    name: Cyprox API Scan Action
    steps:
      - name: Cyprox
        uses: cyproxio/github-actions@v1.0
        with: 
          api_key: ${{ secrets.CYPROX_API_KEY }}
          scan_id: '6408f0b564e2a543a7d7cef2'
          tag_name: ${{ github.sha }}
          fail_action: true
```