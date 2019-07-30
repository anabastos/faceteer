### pup-facebook-group

Facebook group scraper using puppeteer

### Why?
- Researches about user behavior
- Group content tracking

### Install

```bash
$ npm install --global pup-facebook-group
```

### Commands
```
pfg email@test.com password groupId
```

Uses natural language to analyse group content and creates a report with pretty graphs <3

```
pfg email@test.com password groupId --report
```

#### TODO

- [ ] Scraper
    - [x] Basic structure
    - [x] login
    - [x] fetch group posts
    - [x] get post data
    - [ ] get user data
    - [ ] fetch group members data
    - [x] save as json
- [ ] logger
- [ ] retry and edge cases
- [x] Cli (should be improved)
- [ ] Data analysis
- [ ] Graph generation
