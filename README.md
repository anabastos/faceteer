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
    - [ ] Browser
    - [ ] locators
    - [ ] login
    - [ ] fetchAllGroupPosts
    - [ ] saveAsJson
- [ ] Cli
- [ ] Data analysis
- [ ] Graph generation

#### License
```
MIT License

Copyright (c) 2019 Ana Luiza Bastos
```