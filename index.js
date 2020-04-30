/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const keypress = require('keypress')
const { NearestScanner } = require('@toio/scanner')

const DURATION = 700 // ms
const SPEED = {
  forward: [70, 70],
  backward: [-70, -70],
  left: [30, 70],
  right: [70, 30],
}

var x=0,y=0,angle=0;
async function main() {
  // start a scanner to find nearest cube
  const cube = await new NearestScanner().start()

  // connect to the cube
  await cube.connect()

  // set listeners to show toio ID information
  cube
    .on('id:position-id', data => {
      // console.log('[POS ID]', data))
      x = data.x;
      y = data.y;
      angle = data.angle;
      // console.log(x + "," + y + "," +angle); // like 347,158,271
    })
    .on('id:standard-id', data => console.log('[STD ID]', data))
    .on('id:position-id-missed', () => console.log('[POS ID MISSED]'))
    .on('id:standard-id-missed', () => console.log('[STD ID MISSED]'))

    function rotateRelative(a){
      let dest = (a + angle) % 360
      // if (dest <0) dest = 360+dest
      rotateTo(dest)
    }

    function rotateTo(a){
      let vel = 10;
      let th = 5;
      // let dx = Math.sign(t.x - x);
      // let dy = Math.sign(t.y - y);
      let vec = [0,0];
      let da = a - angle;
      console.log("dest: " + a + "cur: " + angle)
      if (Math.abs(da) < th) return;

      if (da >=0){
        vec = [vel,-vel]
      }else{
        vec = [-vel,vel]
      }
      cube.move(...vec, 100)
      setTimeout(rotateTo, 100,a);
    }

  keypress(process.stdin)
  process.stdin.on('keypress', (ch, key) => {
    // ctrl+c or q -> exit process
    if ((key && key.ctrl && key.name === 'c') || (key && key.name === 'q')) {
      process.exit()
    }

    switch (key.name) {
      case 'up':
        cube.move(...SPEED.forward, DURATION)
        break
      case 'down':
        cube.move(...SPEED.backward, DURATION)
        break
      case 'left':
        cube.move(...SPEED.left, DURATION)
        break
      case 'right':
        a = cube.move(...SPEED.right, DURATION)
        console.log(a)
        break
      case 'e':
          console.log("hello")
          t = [{
            x:300,
            y:200,
            angle:90,
            rotateType:0
          }];
          // o = {
          //   moveType: 0x00,
          //   maxSpeed: 0x50,
          //   speedType: 0x00,
          //   timeout: 0x05
          //   //overwrite: true
          // };
          // a = cube.moveTo(t)//,o)
          // a = rotateTo(180)//,o)
          a = rotateRelative(90)//,o)
          console.log(a)
          break
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()
}

main()
