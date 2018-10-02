from autocorrect import spell

def spellchecker(input_file):

    with open(input_file, 'r') as file:
        data = file.read().splitlines()

    output = []

    for line in data:
        words = line.split()
        correct_words = []
        for i in range(0, len(words)):
            correct_words.append(spell(words[i]))
        output.append(correct_words)

    for i in range(len(output)):
        str = " ".join(output[i])
        output[i] = str

    for i in range(len(output)):
        str = output[i] + "\n"
        output[i] = str

    with open(input_file, 'w') as file:
        file.writelines(output)

spellchecker('text.txt')
