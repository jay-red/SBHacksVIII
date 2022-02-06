import os

from json import dumps

amogi_files = []

count = 0

for root, dirs, files in os.walk( os.path.join( "docs", "assets", "amogus" ) ):
	for file in files:
		amogi_files.append( file )
		count += 1

print( dumps( files ) )