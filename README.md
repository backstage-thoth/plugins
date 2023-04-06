# Thoth

Thoth is an app to expose a service catalog.

## Features

- [x] Dockerization
- [x] PostgreSQL
- [x] Sign-in with GitHub
- [x] GitHub organization sync
- [ ] Custom look-and-feel
  - [x] Themes (Dark & Light)
  - [ ] Sidebar
  - [ ] Homepage
- [ ] Documentation
  - [x] OpenAPI and AsyncAPI
  - [x] TechDocs
  - [x] ADRs
  - [x] Common docs (including common ADRs)
  - [ ] C4 diagrams or other architecture diagrams
- [ ] Integrations
  - [x] SonarQube
  - [ ] GitHub (check more plugins)
  - [ ] Grafana
  - [ ] Ansible Semaphore plugin (third-party API plugin)
- [ ] Tech Insights
  - [X] Basic (component)
  - [x] GitHub Code Scanning Insights
  - [ ] GitHub CI/CD Insights
  - [x] Maturity report (page)
  - [ ] Campaigns
- [ ] Service custom metadata (PCI, PII, type of software, etc.)
- [ ] Templates
  - [ ] .NET
- [ ] Do not allow register/unregister entities manually
- [ ] Groups and users
- [ ] Domains and systems
- [ ] Explorer

## Getting Started

To start the app, run:

```sh
yarn install
yarn dev
```

Using Docker:

```bash
./run.sh
```
