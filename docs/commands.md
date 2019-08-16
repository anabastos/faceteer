
### Commands
- [Profiles](#Profiles)
- [Groups](#Groups)
- [Pages](#Pages)
- [Events](#Events)

## Profiles
### Get facebook profile data
The command `profile` will scrape the basic profile data like gender, age, religion, relationships, contacts, work, education of a profile ID or username.
The command will generate a data.json including all the scraped data.

```
faceteer profile email@test.com password profileId
```
you can also use the `p` alias:
```
faceteer p email@test.com password profileId
```

By defeault the option `posts` is `false`, but it's posible to include posts by turning it `true`.
```
faceteer g email@test.com password groupId --members true
```

Sample of the generated data.json:
```json
{
    "romanticRelationship": {},
    "familyRelationship": [],
    "Telefones celulares": "Editar(11) 98699-3010",
    "Email": "analui_95@hotmail.com",
    "Facebook": "http://facebook.com/ana8bastos",
    "Data de nascimento": "13 de junho",
    "Ano de nascimento": "1995",
    "Gênero": "Feminino",
    "Cidade atual": "São Paulo",
    "Cidade natal": "Brasília",
    "name": "Ana Luiza Portello Bastos",
    "age": 23
}
```

## Groups
### Get facebook group data
The command `group` will scrape the group posts and comments.
The command will generate a data.json including all the scraped data.

Including group posts
```
faceteer group email@test.com password groupId
```
you can also use the `g` alias:
```
faceteer g email@test.com password groupId
```

By defeault the option `members`, which includes group members data is `false`.
```
faceteer g email@test.com password groupId --members true
```

Sample of generated data.json
```json
{
    "posts": [
        {
            "post": {
                "op": "Ana Luiza Portello Bastos",
                "date": "24 de julho às 17:48",
                "text": "Regular test",
                "img": null,
                "link": null
            },
            "comments": [
                "Test comment",
                "Test comments 2"
            ]
        },
        ...
    ],
    "members": [
        {
            "romanticRelationship": {},
            "familyRelationship": [],
            "Telefones celulares": "Editar(11) 98699-3010",
            "Email": "analui_95@hotmail.com",
            "Facebook": "http://facebook.com/ana8bastos",
            "Data de nascimento": "13 de junho",
            "Ano de nascimento": "1995",
            "Gênero": "Feminino",
            "Cidade atual": "São Paulo",
            "Cidade natal": "Brasília",
            "name": "Ana Luiza Portello Bastos",
            "age": 23
        },
        ...
    ]
}
```

## Pages
TODO

## Events
TODO