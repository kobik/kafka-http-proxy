FROM mhart/alpine-node:6

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy related files
COPY package.json /home/node/app
COPY index.js /home/node/app
COPY model /home/node/app/model
COPY routes /home/node/app/routes

RUN npm install --production

USER nobody

# Run the js script
ENTRYPOINT ["node", "--max_old_space_size=256", "index.js"]