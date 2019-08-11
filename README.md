### pup-facebook-group

Facebook groups scrapper using puppeter

### Why?
- Researches about comportament of users
- Track usual content of a group

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

- [ ] Scrapper
    - [x] login
    - [x] fetch group posts
    - [x] get post data
    - [x] get user data
    - [ ] fetch group members data
    - [ ] get post reactions
    - [ ] person posts
    - [ ] get life events
    - [ ] refactory
    - [x] save as json
- [ ] logger
- [ ] retry and edgy cases
- [x] Cli(tem mais coisa pra por obvio)
- [ ] Data analysis
- [ ] Graph generation
