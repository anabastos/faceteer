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
    - [x] Basic structure
    - [x] login
    - [x] fetch group posts
    - [ ] get post data
    - [ ] get user data
    - [ ] fetch group members data
    - [ ] save as json
- [x] Cli
- [ ] Data analysis
- [ ] Graph generation
