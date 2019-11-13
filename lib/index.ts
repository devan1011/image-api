const fs      = require('fs');
const path    = require('path');
const sharp   = require('sharp');
const fastify = require('fastify')({ logger: true });

const fastifyStatic = require('fastify-static');

const originalsPath = path.join(__dirname, '/image/original');
const thumbnailsPath = path.join(__dirname, '/image/thumbnail');

const resize = async (
  image,
  outputWidth,
  outputHeight,
  focalX,
  focalY
) => {
  const meta = await image.metadata();

  const inputWidth  = meta.width;
  const inputHeight = meta.height;

  const inputRatio  = inputHeight  / inputWidth;
  const outputRatio = outputHeight / outputWidth;

  if (inputRatio !== outputRatio) {
    const tempWidth  = inputRatio < outputRatio ? (inputHeight / outputRatio) : inputWidth;
    const tempHeight = inputRatio > outputRatio ? (inputWidth  * outputRatio) : inputHeight;

    const inputRealX  = inputWidth  * focalX;
    const inputRealY  = inputHeight * focalY;
    const outputRealX = tempWidth   * focalX;
    const outputRealY = tempHeight  * focalY;

    const realDeltaX = inputRealX - outputRealX;
    const realDeltaY = inputRealY - outputRealY;

    image = image.extract({
      left:   parseInt(realDeltaX),
      top:    parseInt(realDeltaY),
      width:  parseInt(tempWidth),
      height: parseInt(tempHeight),
    });
  }

  return image
    .resize(
      outputWidth,
      outputHeight,
    );
};

fastify.register(fastifyStatic, {
  root: '/',
});

fastify.get('/image/:image', async (request, reply) => {
  const imageParam = request.params.image.match(/(.+)\.([a-zA-Z]{1,4})/);
  const name       = imageParam[1];
  const format     = imageParam[2];

  const width  = parseInt(request.query.w);
  const height = parseInt(request.query.h);

  const focalX = parseFloat(request.query.fx);
  const focalY = parseFloat(request.query.fy);

  const originalPath = path.join(originalsPath, `${name}.jpg`);
  const thumbnailPath = path.join(thumbnailsPath, `${name}-${width}x${height}-${focalX * 10}x${focalY * 10}.${format}`);

  if (!fs.existsSync(thumbnailPath)) {
    const image = await resize(
      sharp(originalPath),
      width,
      height,
      focalX,
      focalY,
    );
    
    await image.toFile(thumbnailPath);      
  }

  reply.sendFile(thumbnailPath);

  return reply;
});

(async () => {
  await fastify.listen(3000);

  fastify.log.info(`server listening on ${fastify.server.address().port}`);
})();
