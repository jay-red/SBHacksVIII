import os
import struct

from json import dumps

amogi_files = []

count = 0

for root, dirs, files in os.walk( os.path.join( "docs", "assets", "amogus" ) ):
	for file in files:
		amogi_files.append( file )
		count += 1

for file in amogi_files:
	txt = open( os.path.join( "docs", "assets", "annotated", file + ".png.txt" ), 'r' )
	nums = txt.read()
	txt.close()

	nums = [ struct.pack( "=h", int( n.strip() ) ) for n in nums.split() ]

	sus = open( os.path.join( "docs", "assets", "sus", file + ".sus" ), "rb" )
	cap = sus.read()
	sus.close()

	os.remove( os.path.join( "docs", "assets", "sus", file + ".sus" ) )

	cap = nums[0] + nums[1] + nums[2] + cap

	sus = open( os.path.join( "docs", "assets", "sus", file + ".sus" ), "wb" )
	sus.write( cap )
	sus.close()