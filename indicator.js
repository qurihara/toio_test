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

var first_pos = true;
var init_pos = [0,0];
async function main() {
  // start a scanner to find nearest cube
  const cube = await new NearestScanner().start()

  // connect to the cube
  await cube.connect()

  // set listeners to show toio ID information
  cube
  .on('id:position-id', data => {
    console.log('[POS ID]', data)
    if (first_pos){
      first_pos = false;
      init_pos = [data.x,data.y,data.angle];
      console.log(init_pos);
    }
  })
  .on('id:standard-id', data => console.log('[STD ID]', data))
  .on('id:position-id-missed', () => console.log('[POS ID MISSED]'))
  .on('id:standard-id-missed', () => console.log('[STD ID MISSED]'))

  keypress(process.stdin)
  process.stdin.on('keypress', (ch, key) => {
    // ctrl+c or q -> exit process
    if ((key && key.ctrl && key.name === 'c') || (key && key.name === 'q')) {
      process.exit()
    }

    let o = {
      moveType: 0x00,
      maxSpeed: 0x10,
      speedType: 0x00,
      timeout: 0x05
      //overwrite: true
    };

    switch (key.name) {
      case 'up':
        tgt = [{
          x:init_pos[0]+30,
          y:init_pos[1],
          angle:0,//init_pos[2],
          rotateType:2
        }];
        cube.moveTo(tgt,o)
        break
      case 'down':
        tgt = [{
          x:init_pos[0]-30,
          y:init_pos[1],
          angle:0,//init_pos[2],
          rotateType:2
      }];
      cube.moveTo(tgt,o)
        break
      case 'left':
        break
      case 'right':
        break
        case 'i':
            console.log("hello")
            t = [{
              x:300,
              y:200,
              angle:90,
              rotateType:0
            }];
            o = {
              moveType: 0x00,
              maxSpeed: 0x50,
              speedType: 0x00,
              timeout: 0x05
              //overwrite: true
            };
            a = cube.moveTo(t,o)
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
          a = cube.moveTo(t)//,o)
          console.log(a)
          break
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()

}

main()
