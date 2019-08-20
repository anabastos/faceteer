import spacy
import json
from collections import Counter
import numpy as np
from scipy import stats
import xlwt 

nlp = spacy.load('pt')

age_list = []
gender_list = []
city_list = []
religion_list = []

with open('../data.json') as json_file:
    data = json.load(json_file)
    text = ''
    for p in data['posts']:
        text = text + ' ' + p['post']['text']
        for c in p['comments']:
            text = text + ' ' + c
    for m in data['members']:
        if 'Gênero' in m['basicInfo']:
            gender_list.append(m['basicInfo']['Gênero'])
        if 'Religião' in m['basicInfo']:
            religion_list.append(m['basicInfo']['Religião'])
        if m['age'] is not None:
            age_list.append(m['age'])
        if 'Cidade atual' in m:
            city_list.append(m['Cidade atual'])

workbook = xlwt.Workbook()  
sheet = workbook.add_sheet("Grupo 1") 
style = xlwt.easyxf('font: bold 1') 

sheet.write(0, 0, 'MEMBERS', style)
print('##### MEMBERS #####')
sheet.write(1, 0, 'GENDER', style)
print('### GENDER ###')
line = 2
gender_counter = Counter(gender_list)
gender_keys = gender_counter.keys()
gender_values = list(gender_counter.values())
for i, name in enumerate(gender_keys, start=0):
    freq = (gender_values[i] / len(gender_list)) * 100
    sheet.write(line, 0, name, style)
    sheet.write(line, 1, freq, style)
    line += 1
    print("- {}: {}%".format(name, freq))
print('### AGE ###')
sheet.write(line, 0, 'AGE', style)
print(age_list)
line += 1
mean= np.mean(age_list)
sheet.write(line, 0, 'MEAN', style)
sheet.write(line, 1, mean, style)
line += 1
median = np.median(age_list)
sheet.write(line, 0, 'MEDIAN', style)
sheet.write(line, 1, median, style)
mode= stats.mode(age_list)
line += 1
sheet.write(line, 0, 'MODE', style)
sheet.write(line, 1, mode, style)
print("Mean: ", mean)
print("Median: ", median)
print("Mode: ", mode)
print('### CITY ###')
line += 1
sheet.write(line, 0, 'CITY', style)
line += 1
city_counter = Counter(city_list)
city_keys = city_counter.keys()
city_values = list(city_counter.values())
for i, name in enumerate(city_keys, start=0):
    freq = (city_values[i] / len(city_list)) * 100
    sheet.write(line, 0, name, style)
    sheet.write(line, 1, freq, style)
    line += 1
    print("- {}: {}%".format(name, freq))
print('### RELIGION ###')
sheet.write(line, 0, 'RELIGION', style)
line += 1
religion_counter = Counter(religion_list)
religion_keys = religion_counter.keys()
religion_values = list(religion_counter.values())
for i, name in enumerate(religion_keys, start=0):
    freq = (religion_values[i] / len(religion_list)) * 100
    sheet.write(line, 0, name, style)
    sheet.write(line, 1, freq, style)
    line += 1
    print("- {}: {}%".format(name, freq))

doc = nlp(text)
entities = [entity for entity in doc.ents]
labeled_entities = [(entity, entity.label_) for entity in doc.ents]

counts = Counter(text.split(' '))
most_common_words = counts.most_common(25)

sheet.write(line, 0, 'POSTS', style)
print('##### POSTS #####')
print('### COUNTS ###')
print(counts)
print('### MOST COMMON WORDS ###')
line += 1
sheet.write(line, 0, 'MOST COMMON', style)
print(most_common_words)
column = 1
for word in most_common_words:
    sheet.write(line, column, word, style)
    column += 1

print('### ENTITIES ###')
line += 1
sheet.write(line, 0, 'ENTITIES COMMON', style)
for ent in labeled_entities:
    # sheet.write(line, 0, word, style)
    # sheet.write(line, 0, word, style)
    # column += 1
print(labeled_entities)
print('### COUNT FILTERED BY ENTITIES ###')
# filtered_count = { key: counts[key] for key in counts.keys() if key in entities}
# print(filtered_count)

workbook.save("data.xls") 