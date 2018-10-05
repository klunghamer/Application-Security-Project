from autocorrect import spell
import sys

#Function will spellcheck inputted file - use 'text.txt' to test implementation

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

print "Please chose a file to spellcheck: "

input = sys.stdin.readline().rstrip()
spellchecker(input)
