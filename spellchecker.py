from autocorrect import spell

def spellchecker(file, new_file):

    with open(new_file, 'w') as new_file:

        with open(file) as f:
            for line in f:
                for word in line.split():
                    new_file.write(spell(word) + ' ')
                new_file.write("\n")


spellchecker('text.txt', 'output.txt')
