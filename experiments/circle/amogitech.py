import os
import cv2
import numpy as np
import imutils

for root, dirs, files in os.walk( "amogus" ):
	for file in files:
		raw = cv2.imread( os.path.join( root, file ) )

		edge = cv2.cvtColor( raw, cv2.COLOR_BGR2GRAY )

		edge = cv2.GaussianBlur( edge, ( 5, 5 ), 0 )
		edge = cv2.medianBlur( edge, 5 )

		edge = cv2.adaptiveThreshold( edge, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 3.5 )

		kernel = np.ones( ( 5, 5 ), np.uint8 )

		edge = cv2.erode( edge, kernel, iterations = 1 )

		edge = cv2.dilate( edge, kernel, iterations = 1 )

		cv2.imshow("Detected Circle", edge)
		cv2.waitKey(0)

		contours, hierarchy = cv2.findContours(edge, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

		idx = 0

		ellipse_list = []
		contour_list = []
		for contour in contours:
			if hierarchy[0, idx, 3] != -1:
				contour = cv2.convexHull( contour )
				approx = cv2.approxPolyDP( contour, 0.001*cv2.arcLength( contour,True ), True )

				p = cv2.arcLength( approx, True )
				a = cv2.contourArea( approx )

				if ( ( 4 * np.pi * a / p / p ) > 0.84 ) and a > 100:
					contour_list.append( approx )
					ellipse_list.append( cv2.fitEllipse( approx ) )

			idx += 1

		blank_image = np.zeros( raw.shape, np.uint8 )

		ellipse_depth = []

		count = 0

		for ellipse1 in ellipse_list:
			layer = 0
			for ellipse2 in ellipse_list:
				if ellipse1 == ellipse2:
					continue
				radius1 = max( ellipse1[1] ) / 2.0
				radius2 = max( ellipse2[1] ) / 2.0
				x = ellipse1[0][0] - ellipse2[0][0]
				y = ellipse1[0][1] - ellipse2[0][1]
				if np.sqrt( x * x + y * y ) < radius2 and radius1 < radius2:
					layer += 1
			if layer + 1 > len( ellipse_depth ):
				for _ in range( layer + 1 - len( ellipse_depth ) ):
					ellipse_depth.append( [] )
			ellipse_depth[layer].append( ellipse1 )

		if len( ellipse_depth ) > 0:
			ellipse_depth = ellipse_depth[-1]
			ellipse_depth.sort( key = lambda x : max( x[1] ), reverse = True )
			cv2.ellipse( raw, ellipse_depth[0], ( 255, 0, 0 ), 3 )

		cv2.imshow( "Detected Circle", raw )
		cv2.waitKey(0)