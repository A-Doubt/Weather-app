import './style.scss';
import img from './assets/iq.png';

console.log('hello from script.js');
const body = document.querySelector('body');

const image = document.createElement('img');
image.src = img;
body.append(image)