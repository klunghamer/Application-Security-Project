from autocorrect import spell

def spellchecker(file):
    #print spell('theee')
    words = []

    with open(file) as f:
        for line in f:
            for word in line.split():
                words.append(word)

    for i in range(0, len(words)):
        correct_word = spell(words[i])
        # print correct_word
        words[i] = correct_word

    print words


spellchecker('text.txt')
