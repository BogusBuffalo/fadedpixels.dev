var bbb = 0.0;
// requestAnimationFrame support
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());


var Player = function (x, y) {
    var me = {
        //position
        x: x + 20.5,
        y: y + 3.5, //center in the tile
        //direction
        dx: 1.0, //cos(player direction)
        dy: 0.0, //sin(player direction)
        //camera
        cx: 0.0,
        cy: 0.66, //FOV inÂ°

        speed: 0.0,
        rotspeed: 0.05,

        up: false,
        down: false,
        right: false,
        left: false
    };

    me.init = function () {

        // precalculate these
        me.cos_rotspeedp = Math.cos(me.rotspeed);
        me.cos_rotspeedn = Math.cos(-me.rotspeed);
        me.sin_rotspeedp = Math.sin(me.rotspeed);
        me.sin_rotspeedn = Math.sin(-me.rotspeed);

        document.addEventListener("keydown", me.key_down, false);
        document.addEventListener("keyup", me.key_up, false);
    };

    me.update = function (map) {
        
        var change_x = me.dx * me.speed,
            change_y = me.dy * me.speed,
            cx, dx;
          
          if (!me.up && !me.down) {
            if (me.speed < 0.001 && me.speed > -0.001 && me.speed !== 0.0) {
                me.speed = 0.0; 
            }
            if (me.speed < -0.001){
                me.speed = me.speed * (1 + (0.00075/me.speed)); 
            }
            if (me.speed > 0.001){
                me.speed = me.speed * (1 - (0.00075/me.speed)); 
            }
            if (!map.is_free(Math.floor(me.x + change_x), Math.floor(me.y + change_y))) {
                if (map.is_free(Math.floor(me.x-(change_x*20)), Math.floor(me.y-(change_y*20)))) {
                me.x -= change_x*20;
                me.y -= change_y*20;
                me.speed = me.speed / 2;
              }
              else {
                me.speed = me.speed / 2;  
              }
            }
            else {
                me.x += change_x;
                me.y += change_y;
            }
          } 
          
          else if (me.up) {
            if (me.speed <= 0.0) {
                me.speed += 0.003; 
            }
            if (me.speed > 0.0 && me.speed <= 0.1){
                me.speed = me.speed * (1 + (0.001/me.speed)); 
            }
            if (me.speed > 0.1 && me.speed <= 0.3){
                me.speed = me.speed * (1 + (0.00001/Math.pow(me.speed, 3))); 
            }
            if (me.speed > 0.3){
                me.speed = 0.3; 
            }
            
            if (!map.is_free(Math.floor(me.x + change_x), Math.floor(me.y + change_y))) {
              if (map.is_free(Math.floor(me.x-(change_x*20)), Math.floor(me.y-(change_y*20)))) {
                me.x -= change_x*20;
                me.y -= change_y*20;
                me.speed = me.speed / 2;
              }
              else {
                me.speed = me.speed / 2;  
              }
            } 
            else {
                me.x += change_x;
                me.y += change_y;
            }
          } 
          
          else if (me.down) {
            if (me.speed > 0.1) {
                me.speed = me.speed * 0.985;
            }
            if (me.speed > 0.025 && me.speed <= 0.1) {
                me.speed = me.speed * 0.95;
            }
            if (me.speed > 0.001 && me.speed <= 0.025) {
                me.speed -= 0.001;
            }
            if (me.speed >= 0.0 && me.speed <= 0.001) {
                me.speed = -0.0009;
            }
            if (me.speed < 0.0 && me.speed >= -0.01) {
                me.speed -= 0.001;
            }
            if (me.speed < -0.01 && me.speed > -0.1) {
                me.speed *= 1.025;
            }
            if (me.speed < -0.1) {
                me.speed = -0.1;
            }
            
            if (!map.is_free(Math.floor(me.x + change_x), Math.floor(me.y + change_y))) {
                if (map.is_free(Math.floor(me.x-(change_x*20)), Math.floor(me.y-(change_y*20)))) {
                me.x -= change_x*20;
                me.y -= change_y*20;
                me.speed = me.speed / 2;
              }
              else {
                me.speed = me.speed / 2;  
              }
            }
            else {
                me.x += change_x;
                me.y += change_y;
            }
          }

        if (me.left && map.is_free(Math.floor(me.x), Math.floor(me.y))) {
            dx = me.dx;
            cx = me.cx;
            if (!me.down) {
              me.dx = dx * me.cos_rotspeedp - me.dy * me.sin_rotspeedp;
              me.dy = dx * me.sin_rotspeedp + me.dy * me.cos_rotspeedp;
              me.cx = cx * me.cos_rotspeedp - me.cy * me.sin_rotspeedp;
              me.cy = cx * me.sin_rotspeedp + me.cy * me.cos_rotspeedp;
            }
            if (me.down) {
              if (me.speed < 0.0) {
                me.dx = dx * me.cos_rotspeedn - me.dy * me.sin_rotspeedn;
                me.dy = dx * me.sin_rotspeedn + me.dy * me.cos_rotspeedn;
                me.cx = cx * me.cos_rotspeedn - me.cy * me.sin_rotspeedn;
                me.cy = cx * me.sin_rotspeedn + me.cy * me.cos_rotspeedn;
              }
              else {
                me.dx = dx * me.cos_rotspeedp - me.dy * me.sin_rotspeedp;
                me.dy = dx * me.sin_rotspeedp + me.dy * me.cos_rotspeedp;
                me.cx = cx * me.cos_rotspeedp - me.cy * me.sin_rotspeedp;
                me.cy = cx * me.sin_rotspeedp + me.cy * me.cos_rotspeedp;
              }
            }     
        }
        
        if (me.right && map.is_free(Math.floor(me.x), Math.floor(me.y))) {
            dx = me.dx;
            cx = me.cx;
            if (me.down) {
              if (me.speed < 0.0) {
                me.dx = dx * me.cos_rotspeedp - me.dy * me.sin_rotspeedp;
                me.dy = dx * me.sin_rotspeedp + me.dy * me.cos_rotspeedp;
                me.cx = cx * me.cos_rotspeedp - me.cy * me.sin_rotspeedp;
                me.cy = cx * me.sin_rotspeedp + me.cy * me.cos_rotspeedp;
              }
              else {
                me.dx = dx * me.cos_rotspeedn - me.dy * me.sin_rotspeedn;
                me.dy = dx * me.sin_rotspeedn + me.dy * me.cos_rotspeedn;
                me.cx = cx * me.cos_rotspeedn - me.cy * me.sin_rotspeedn;
                me.cy = cx * me.sin_rotspeedn + me.cy * me.cos_rotspeedn;
              }
            }
            if (!me.down) {
              me.dx = dx * me.cos_rotspeedn - me.dy * me.sin_rotspeedn;
              me.dy = dx * me.sin_rotspeedn + me.dy * me.cos_rotspeedn;
              me.cx = cx * me.cos_rotspeedn - me.cy * me.sin_rotspeedn;
              me.cy = cx * me.sin_rotspeedn + me.cy * me.cos_rotspeedn;
            }
        }
    };

    me.key_down = function (event) {
        // up
        if (event.keyCode == 38 || event.keyCode == 87) {
            me.up = true;
        }
        // left
        if (event.keyCode == 37 || event.keyCode == 65) {
            me.left = true;
        }
        // right
        if (event.keyCode == 39 || event.keyCode == 68) {
            me.right = true;
        }  
        // down
        if (event.keyCode == 40 || event.keyCode == 83) {
            me.down = true;
        }
        
    };
    
    me.key_up = function (event) {
        // left
        if (event.keyCode == 37 || event.keyCode == 65) {
            me.left = false;
        }
        // right
        if (event.keyCode == 39 || event.keyCode == 68) {
            me.right = false;
        }
        // up
        if (event.keyCode == 38 || event.keyCode == 87) {
            me.up = false;
        }
        // down
        if (event.keyCode == 40 || event.keyCode == 83) {
            me.down = false;
        }
    };

    me.init();

    return me;
};

var Obj = function (name, x, y, size, texture) {
    var me = {
        name: name,
        x: x,
        y: y,
        size: size, // 0..1 (for a 256x256 wall texture)
        texture: texture
    };

    me.distance = function (x, y) {
        return Math.pow(x - me.x, 2) + Math.pow(y - me.y, 2);
    };

    return me;
};

var Objects = function () {
    var me = {
        textures: [],
        objs: []
    };

    me.init = function () {
        var ver = 1, // increase this for refreshing the cache
            i,
            files = [''];

        for (i = 0; i < files.length; i++) {
            me.textures[i] = new Image();
            me.textures[i].src = files[i] + "?" + ver;
        }
    };

    me.add = function (name, x, y, size, texture) {
        me.objs[me.objs.length] = Obj(name, x, y, size, texture);
    };

    me.remove = function (index) {
        delete me.objs[index];
    };

    me.sorted = function (x, y) {
        var o, t = [];
        for (o in me.objs) {
            t[t.length] = {
                obj: me.objs[o],
                dist: me.objs[o].distance(x, y)
            };
        }
        return t.sort(function (a, b) {
            return b.dist - a.dist;
        });
    };

    me.get_texture = function (idx) {
        return me.textures[idx];
    };

    me.init();

    return me;
};

var Map = function () {
    var me = {
        UNUSED: -1,
        FREE: 0,
        BLOCK: 1,
        SIGNL: 2,
        SIGNR: 3,
        data: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 
        1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
        1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
        1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 1, 
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 
        1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ],
        automap: [],
        width: 40,
        height: 40,

        textures: [],
        bg: undefined,

        floor0: 'rgb(42, 41, 34)',
        floor1: 'rgb(40, 40, 40)',
        ceiling0: 'rgb(0, 130, 200)',
        ceiling1: 'rgb(0, 200, 255)',

        objs: Objects()
    };

    me.init = function () {
        var ver = 1, // increase this for refreshing the cache
            i,
            files = ['', 'https://imgur.com/lfAOlAZ.png', 'https://imgur.com/06y9XR1.png', 'https://imgur.com/RaCDdkl.png'];

        for (i = 0; i < files.length; i++) {
            me.textures[i] = new Image();
            me.textures[i].src = files[i] + "?" + ver;
        }

        for (i = 0; i < me.width * me.height; i++) {
            me.automap[i] = me.UNUSED;
        }

        me.bg = new Image();
        me.bg.src = '';
    };

    me.texture = function (idx) {
        return me.textures[idx];
    };

    me.get_texture = function (x, y) {
        return me.texture(me.data[y * me.width + x]);
    };

    me.is_free = function (x, y) {
        if (x < 0 || x >= me.width || y < 0 || y >= me.height) {
            return false;
        }
        return me.data[y * me.width + x] == 0;
    };

    me.record_auto = function (x, y) {
        me.automap[y * me.width + x] = me.data[y * me.width + x];
    };

    me.get_auto = function (x, y) {
        return me.automap[y * me.width + x];
    };

    me.init();

    return me;
};

var Application = function (id) {
    var me = {
        id: id,
        canvas: undefined,
        canvas_ctx: undefined,

        buffer: undefined,
        ctx: undefined,

        map: Map(),
        player: Player(1, 1),

        show_map: false,

        // canvas size
        width: 1024,
        height: 800,

        // 3D scene size
        _width: 1024,
        _height: 800,

        fps: 60,
        _time: Date.now(),
        _frames: 0
    };

    me.setup = function () {
        me.canvas = document.getElementById(me.id);
        
        if (me.canvas.getContext) {
            me.canvas.width = me.width;
            me.canvas.height = me.height;
            me.canvas.style.background = "rgb(0, 0, 0)";

            me.buffer = document.createElement('canvas');
            me.buffer.width = me._width;
            me.buffer.height = me._height;

            me.ctx = me.buffer.getContext("2d");
            me.canvas_ctx = me.canvas.getContext("2d");

            return true;
        }
        return false;
    };

    me.draw = function () {
        me.ctx.clearRect(0, 0, me.width, me.height);

        // floor / ceiling 
        var grad = me.ctx.createLinearGradient(0, me._height / 2, 0, me._height);
        grad.addColorStop(0, me.map.floor0);
        grad.addColorStop(1, me.map.floor1);
        me.ctx.fillStyle = grad
        me.ctx.fillRect(0, me._height / 2, me._width, me._height / 2);
        grad = me.ctx.createLinearGradient(0, 0, 0, me._height / 2);
        grad.addColorStop(1, me.map.ceiling0);
        grad.addColorStop(0, me.map.ceiling1);
        me.ctx.fillStyle = grad
        me.ctx.fillRect(0, 0, me._width, me._height / 2);

        var col,
        zBuffer = []; // used for sprites (objects)
        for (col = 0; col < me._width; col++) { //col is current horizontal distance
            var camera, ray_x, ray_y, ray_dx, ray_dy, mx, my, delta_x,
            delta_y, step_x, step_y, horiz, wall_dist, wall_height,
            wall_x, draw_start, tex;

            camera = 2 * col / me._width - 1; // on screen, left=-1, middle=0, right=1
            ray_x = me.player.x; //player x position
            ray_y = me.player.y; //player y position
            ray_dx = me.player.dx + me.player.cx * -camera;
            ray_dy = me.player.dy + me.player.cy * -camera;
            mx = Math.floor(ray_x); //ray_x to int
            my = Math.floor(ray_y); //ray_y to int
            delta_x = Math.sqrt(1 + (ray_dy * ray_dy) / (ray_dx * ray_dx));
            delta_y = Math.sqrt(1 + (ray_dx * ray_dx) / (ray_dy * ray_dy));

            // initial step for the ray
            if (ray_dx < 0) { 
                step_x = -1;
                dist_x = (ray_x - mx) * delta_x;
            } else {
                step_x = 1;
                dist_x = (mx + 1 - ray_x) * delta_x;
            }
            if (ray_dy < 0) {
                step_y = -1;
                dist_y = (ray_y - my) * delta_y;
            } else {
                step_y = 1;
                dist_y = (my + 1 - ray_y) * delta_y;
            }

            // DDA
            while (true) {
                if (dist_x < dist_y) {
                    dist_x += delta_x;
                    mx += step_x;
                    horiz = true;
                } else {
                    dist_y += delta_y;
                    my += step_y;
                    horiz = false;
                }

                // for automap
                me.map.record_auto(mx, my);

                if (!me.map.is_free(mx, my)) {
                    break;
                }
            }

            // wall distance
            if (horiz) {
                wall_dist = (mx - ray_x + (1 - step_x) / 2) / ray_dx;
                wall_x = ray_y + ((mx - ray_x + (1 - step_x) / 2) / ray_dx) * ray_dy;
            } else {
                wall_dist = (my - ray_y + (1 - step_y) / 2) / ray_dy;
                wall_x = ray_x + ((my - ray_y + (1 - step_y) / 2) / ray_dy) * ray_dx;
            }
            wall_x -= Math.floor(wall_x);

            if (wall_dist < 0) {
                wall_dist = -wall_dist;
            }

            zBuffer[col] = wall_dist;

            wall_height = Math.abs(Math.floor(me._height / wall_dist));
            draw_start = -wall_height / 2 + me._height / 2;

            wall_x = Math.floor(wall_x * me.map.get_texture(mx, my).width);
            if (horiz && ray_dx > 0) {
                wall_x = me.map.get_texture(mx, my).width - wall_x - 1;
            }
            if (!horiz && ray_dy < 0) {
                wall_x = me.map.get_texture(mx, my).width - wall_x - 1;
            }

            tex = me.map.get_texture(mx, my);
            me.ctx.drawImage(tex, wall_x, 0, 1, tex.height, col, draw_start, 1, wall_height);

        }

        // sprites (Objects)
        var i, col, sprite_x, sprite_y, inv, trans_x, trans_y, screen_x,
        sprite_size, start_x, start_y, tex, tex_start_x, tex_x;

        var sprites = me.map.objs.sorted(me.player.x, me.player.y);
        for (i = 0; i < sprites.length; i++) {
            sprite_x = sprites[i].obj.x - me.player.x;
            sprite_y = sprites[i].obj.y - me.player.y;

            inv = 1.0 / (me.player.cx * me.player.dy - me.player.dx * me.player.cy);
            trans_x = inv * (me.player.dy * sprite_x - me.player.dx * sprite_y);
            trans_y = inv * (-me.player.cy * sprite_x + me.player.cx * sprite_y);
            screen_x = Math.floor((me._width / 2) * (1 + trans_x / trans_y));

            sprite_size = Math.abs(Math.floor(me._height / trans_y)) * sprites[i].obj.size;
            start_y = Math.floor(-sprite_size / 2 + me._height / 2);
            if (start_y < 0) {
                start_y = 0;
            }

            start_x = Math.floor(-sprite_size / 2 + screen_x);
            tex_start_x = 0;
            if (start_x < 0) {
                tex_start_x = -start_x;
                start_x = 0;
            }
            end_x = Math.floor(sprite_size / 2 + screen_x);
            if (end_x >= me._width) {
                end_x = me._width - 1;
            }

            for (col = start_x; col < end_x; col++) {
                if (trans_y > 0 && col > 0 && col < me._width && trans_y < zBuffer[col]) {
                    tex = me.map.objs.get_texture(sprites[i].obj.texture);
                    tex_x = Math.floor((col - start_x) * tex.width / sprite_size);
                    me.ctx.drawImage(tex, tex_start_x + tex_x, 0, 1, tex.height, col, start_y + Math.floor(256 / trans_y) - sprite_size / 2, 1, sprite_size);
                }
            }
        }

        me.canvas_ctx.clearRect(0, 0, me.canvas.width, me.canvas.height);
        me.canvas_ctx.drawImage(me.buffer, 0, 0);

        // FPS
        var time = Date.now();

        me._frames++;

        me.canvas_ctx.fillStyle = "rgb(255, 0, 0)";
        me.canvas_ctx.fillText("FPS: " + Math.round(me._frames * 1000 / (time - me._time)), 1, me.height - 5);

        if (time > me._time + me.fps * 1000) {
            me._time = time;
            me._frames = 0;
        }
        
        // change map
      /*  var aaa = Math.floor(Math.random() * Math.floor(2));
        var ii, jj;
        if (aaa == 0 && bbb == 0) {
          bbb = 1;
          for (ii = 0; ii < 8; ii++) {
            me.map.data[ii + (40*24) + 17] = 1;
            me.map.data[ii + (40*32) + 17] = 0;
            me.map.data[ii*40 + (40*15) + 7] = 0;
            me.map.data[ii*40 + (40*31) + 15] = 1;
          }
          me.map.data[95] = 1;
        }
        if (aaa == 1 && bbb == 0) {
          bbb = 1;
          me.map.data[95] = 0;
        }
        if (bbb == 1 && me.player.x > 16 && me.player.y > 16) {
          bbb++;
        }
        if (bbb == 2 && me.player.x < 24 && me.player.y < 24) {
          bbb++;
        }
        if (bbb == 3 && me.player.x < 16 && me.player.y < 16) {
          bbb = 0;  
        }*/
    };

    me.draw_map = function () {

        var i, j, s = 8,
            d = 5;
        
        var qq = Math.floor(me.player.speed * 1000);
        me.ctx.save();
        me.ctx.font = 'bold 20pt MedievalSharp'
        me.ctx.textAlign = "center";
        me.ctx.fillStyle = "rgb(0, 0, 0)";
        me.ctx.fillText(qq, me._width / 2, me._height - 20);

        for (i = 0; i < me.map.height; i++) {
            for (j = 0; j < me.map.width; j++) {
                if (me.map.get_auto(me.map.height-i-1, me.map.width-j-1) == me.map.BLOCK || me.map.get_auto(me.map.height-i-1, me.map.width-j-1) == me.map.SIGNL || me.map.get_auto(me.map.height-i-1, me.map.width-j-1) == me.map.SIGNR) {
                    me.ctx.fillStyle = "rgba(60, 60, 60, 0.2)";
                    me.ctx.fillRect(d + j * s, d + i * s, s, s);
                    me.ctx.strokeStyle = "rgb(0, 0, 0, 0.2)";
                    me.ctx.strokeRect(d + j * s, d + i * s, s, s);
                    continue;
                }
                if (me.map.get_auto(me.map.height-i-1, me.map.width-j-1) == me.map.FREE) {
                    me.ctx.fillStyle = "rgba(160, 160, 160, 0.1)";
                    me.ctx.fillRect(d + j * s, d + i * s, s, s);
                }
            }
        }

        me.ctx.fillStyle = "rgb(0, 225, 0)";
        me.ctx.fillRect((d+(me.map.width-1-Math.floor(me.player.y))*s), (d+(me.map.height-1-Math.floor(me.player.x))*s), s, s);
        me.ctx.restore();

        me.canvas_ctx.clearRect(0, 0, me.canvas.width, me.canvas.height);
        me.canvas_ctx.drawImage(me.buffer, 0, 0);

    };

    me.loop = function () {
        requestAnimationFrame(me.loop);
        me.player.update(me.map);
        me.draw();
        me.draw_map();
    };

    me.run = function () {
        if (me.setup()) {
            me.loop();
        }
    };


    me.init = function () {
        document.addEventListener("keydown", me.key_down, false);
        document.addEventListener("keyup", me.key_up, false);
        window.onresize = me.resize

    };

    me.init();

    return me;
};

window.onload = function () {
    var app = Application("myCanvas");
    app.run();
};
