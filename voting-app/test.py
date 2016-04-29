import os
import random
import socket

option_a = os.getenv('OPTION_A', "Cats")
option_b = os.getenv('OPTION_B', "Dogs")
hostname = socket.gethostname()

print option_a
print option_b
print hostname

getrandbits = random.getrandbits(64)
print "source1"
print getrandbits
s = hex(getrandbits)
print "source2"
print s
voter_id = hex(getrandbits)[2:-1]
print "source3"
print voter_id

random_getrandbits = random.randint(0, 100)
print random_getrandbits
randint = random.randint(0, 100)
print "1:" + str(randint)
random_getrandbits = hex(randint)
print "2:" + str(random_getrandbits)
random_getrandbits = hex(randint)
print "3:" + str(random_getrandbits)[1:-1]
