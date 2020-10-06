
module octahedron() {
    module cutter() {
        translate([-50, -50, 0]) cube([100, 100, 10]);
    }
    module do_cut() {
        translate([0, 1, 0])
        rotate([-45, 0, 0])
        cutter();
        translate([0, -1, 0])
        rotate([45, 0, 0])
        cutter();
        translate([0, 1, 0])
        rotate([-45-90, 0, 0])
        cutter();
        translate([0, -1, 0])
        rotate([45+90, 0, 0])
        cutter();
    }
    difference() {
        cube([2, 2, 2], true);
        do_cut();
        rotate([0, 0, 90]) do_cut();
    }
}

//    rotate([45, 0, 0]) translate([-.5, -.5, -.5]) polyhedron (points=[[0,0,0],[0,1,0],[0,1,1],[0,0,1],[1,0,0],[1,1,0],[1,1,1],[1,0,1]], faces=[[0,1,2,3],[4,5,6,7],[3,2,6,7],[1,5,6,2],[0,4,7,3],[0,1,5,4]]);
// polyhedron(points=[
//    [1,0,0],
//    [0,1,0],
//    [0,0,1],
//    [-1,0,0],
//    [0,-1,0],
//    [0,0,-1],
//    ], faces=[
//    [0,1,2],
//    [1,2,3],
//    [2,3,4],
//
//    ]);   


//minkowski() {
//    cube(30, center=true);
//    scale(5)
//    rotate([0, 0, 45]) octahedron();
//}
module pattern(nn, h=7.5, r=5, s=14) {
    
    module dot(scale=1) {
        translate([0, 0, -h/2]) minkowski() {
            
            scale([scale, scale, 1])
            translate([1, 0, 0])
            rotate([0, 0, 180])
            cylinder(h=h-4, r=r, center=true, $fn =3);
            // sphere(h=1, r=2, center=true, $fn=12);
            
            // rotate([0, 0, 0])
            // rotate([45, 0, 0])
            // cube([2, 2, 2], center=true);
            
            scale(2)
            rotate([0, 0, 45]) octahedron();
        }
    }
    if (nn == 1) {
        dot(2);
    } else if (nn == 2) {
       translate([s, s, 0]) dot();
       translate([-s, -s, 0]) dot();
    } else if (nn == 3) {
       translate([s, s, 0]) dot();
       translate([-s, -s, 0]) dot();
       dot();
    } else if (nn == 4) {
       translate([s, s, 0]) dot();
       translate([s, -s, 0]) dot();
       translate([-s, -s, 0]) dot();
       translate([-s, s, 0]) dot();
    } else if (nn == 5) {
       translate([s, s, 0]) dot();
       translate([s, -s, 0]) dot();
       translate([-s, -s, 0]) dot();
       translate([-s, s, 0]) dot();
       dot();
    } else if (nn == 6) {
       translate([s, s, 0]) dot();
       translate([s, -s, 0]) dot();
       translate([-s, -s, 0]) dot();
       translate([-s, s, 0]) dot();
       translate([0, -s, 0]) dot();
       translate([0, s, 0]) dot();
    }         

}


module dots() {
    rotate(90, [0, 1, 0])
    translate([0, 0, 30])
    pattern(1);
    
    rotate(-90, [1, 0, 0])
    translate([0, 0, 30])
    pattern(2);
    
    rotate(180, [0, 1, 0])
    translate([0, 0, 30])
    pattern(3);
    
    rotate(0, [0, 1, 0])
    translate([0, 0, 30])
    pattern(4);
    
    rotate(90, [1, 0, 0])
    translate([0, 0, 30])
    pattern(5);
    
    rotate(-90, [0, 1, 0])
    translate([0, 0, 30])
    pattern(6);
}



module main() {
    color("red") cube([55, 55, 55], center=true);
    dots();
    difference() {
        minkowski() {
            sphere(5, $fn=32);
            cube(50, center=true);
        }
        cube([70, 45, 45], center=true);
        cube([45, 70, 45], center=true);
        cube([45, 45, 70], center=true);
    }
}

main();