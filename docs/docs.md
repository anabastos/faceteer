
### Get facebook user data
```
pfg email@test.com password personId
```

Sample of generated data.json
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

### Get facebook group data
Including group posts and members data
```
pfg email@test.com password groupId
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