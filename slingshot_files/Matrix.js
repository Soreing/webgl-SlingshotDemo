var m4 = { 
translation: function(tx, ty, tz) 
{
	return [
     1,  0,  0, tx,
	 0,  1,  0, ty,
	 0,  0,  1, tz,
     0,  0,  0,  1 ];
},
     
xRotation: function(angleInRadians) 
{
	var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
     
    return [  
	 1,  0,  0,  0,
     0,  c,  s,  0,
     0, -s,  c,  0,
     0,  0,  0,  1 ];
},
     
yRotation: function(angleInRadians) 
{
	var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
     
    return [
	 c,  0, -s,  0,
     0,  1,  0,  0,
     s,  0,  c,  0,
     0,  0,  0,  1 ];
},
     
zRotation: function(angleInRadians) 
{
	var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
     
    return [  
	 c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1 ];
},
     
scaling: function(sx, sy, sz) 
{
    return [
	sx, 0,  0,  0,
     0, sy,  0,  0,
     0,  0, sz,  0,
     0,  0,  0,  1 ];
},

multiply: function(a, b)
{
	return [
	a[0] * b[0 ] + a[4] * b[1 ] + a[8 ] * b[2 ] + a[12] * b[3 ],
	a[1] * b[0 ] + a[5] * b[1 ] + a[9 ] * b[2 ] + a[13] * b[3 ],
	a[2] * b[0 ] + a[6] * b[1 ] + a[10] * b[2 ] + a[14] * b[3 ],
	a[3] * b[0 ] + a[7] * b[1 ] + a[11] * b[2 ] + a[15] * b[3 ],
	a[0] * b[4 ] + a[4] * b[5 ] + a[8 ] * b[6 ] + a[12] * b[7 ],
	a[1] * b[4 ] + a[5] * b[5 ] + a[9 ] * b[6 ] + a[13] * b[7 ],
	a[2] * b[4 ] + a[6] * b[5 ] + a[10] * b[6 ] + a[14] * b[7 ],
	a[3] * b[4 ] + a[7] * b[5 ] + a[11] * b[6 ] + a[15] * b[7 ],
	a[0] * b[8 ] + a[4] * b[9 ] + a[8 ] * b[10] + a[12] * b[11],
	a[1] * b[8 ] + a[5] * b[9 ] + a[9 ] * b[10] + a[13] * b[11],
	a[2] * b[8 ] + a[6] * b[9 ] + a[10] * b[10] + a[14] * b[11],
	a[3] * b[8 ] + a[7] * b[9 ] + a[11] * b[10] + a[15] * b[11],
	a[0] * b[12] + a[4] * b[13] + a[8 ] * b[14] + a[12] * b[15],
	a[1] * b[12] + a[5] * b[13] + a[9 ] * b[14] + a[13] * b[15],
	a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
	a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15] ];
},

};