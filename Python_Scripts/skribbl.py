# Imports
import os
import glob
import numpy as np

# Import keras with tensorflow backend
from tensorflow import keras
import tensorflow.keras.layers as layers
import tensorflow as tf

import matplotlib.pyplot as plt
from random import randint


# Download the dataset
import urllib.request
def download():
    base = 'https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/'
    for c in classes:
        cls_url = c.replace('_', '%20')
        path = base+cls_url+'.npy'
        print(path)
        urllib.request.urlretrieve(path, 'c:/quickdraw_dataset/'+c+'.npy')


# Load the data
# Load 5000 images per class to memory
def load_data(root, vfold_ratio=0.2, max_items_per_class=5000):
    all_files = glob.glob(os.path.join(root, '*.npy'))

    # Initialize variables
    x = np.empty([0, 784])
    y = np.empty([0])
    class_names = []

    # Load each data file
    for idx, file in enumerate(all_files):
        print("reading file: ", file)
        data = np.load(file)
        data = data[0: max_items_per_class, :]
        labels = np.full(data.shape[0], idx)

        x = np.concatenate((x, data), axis=0)
        y = np.append(y, labels)

        class_name, ext = os.path.splitext(os.path.basename(file))
        class_names.append(class_name)

    # Randomize the dataset
    permutation = np.random.permutation(y.shape[0])
    x = x[permutation, :]
    y = y[permutation]

    # Separate into training and testing
    vfold_size = int(x.shape[0] / 100 * (vfold_ratio * 100))

    x_test = x[0:vfold_size, :]
    y_test = y[0:vfold_size]

    x_train = x[vfold_size:x.shape[0], :]
    y_train = y[vfold_size:y.shape[0]]
    return x_train, y_train, x_test, y_test, class_names


# Read class names
f = open("skribbl_classes.txt", "r")
classes = f.readlines()
f.close()

classes = [c.replace('\n', '').replace(' ', '_') for c in classes]


# Download the class files
# download()


# Read in the data
x_train, y_train, x_test, y_test, class_names = load_data('c:/quickdraw_dataset')
num_classes = len(class_names)
image_size = 28

print(len(x_train))

idx = randint(0, len(x_train))
plt.imshow(x_train[idx].reshape(28, 28))
print(class_names[int(y_train[idx].item())])


# Preprocess the data to prepare it for training
# Reshape and normalize
x_train = x_train.reshape(x_train.shape[0], image_size, image_size, 1).astype('float32')
x_test = x_test.reshape(x_test.shape[0], image_size, image_size, 1).astype('float32')

x_train /= 255.0
x_test /= 255.0


# Convert class vectors to class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)


# Create the model
# Create CNN
# This model has 3 2D-convolution layers and 2 dense layers
# The sequential model is a linear stack of layers.
# Define model
model = keras.Sequential()
# This layer applies 16 convolution filters of size 3x3 each.
# The activation function relu takes the negative values in the tensor and replaces them with zeros.
model.add(layers.Convolution2D(16, (3, 3),
                        padding='same',
                        input_shape=x_train.shape[1:], activation='relu'))
# Max pooling layer with pooling size 2x2
# pool_size: tuple of 2 integers, factors by which to downscale (vertical, horizontal)
# Pool size of (2, 2) will halve the input in both spatial dimension.
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
# This layer applies 32 convolution filters of size 3x3 each.
model.add(layers.Convolution2D(32, (3, 3), padding='same', activation='relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
# This layer applies 64 convolution filters of size 3x3 each.
model.add(layers.Convolution2D(64, (3, 3), padding='same', activation='relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
# This layer flattens the input. This does not affect batch size.
# Flatten the layers to use it for the dense layers
# This converts the input from the shape [batch_size,a,b,c] to [batch_size,axbxc]
# This is important because in the dense layers we cannot apply 2D arrays.
model.add(layers.Flatten())
# Fully connected layer/Layer of feed forward neural network/Dense layer with 128 hidden units/neurons/nodes
# Activation function = relu (rectified linear unit)
model.add(layers.Dense(128, activation='relu'))
# Last layer of the network with 100 output neurons because we have 100 classes
# Dense layer with output units 100 which represents the number of classes we need in our recognition system.
# Final activation function = softmax
# The final result should be a class probability in order to achieve a qualitative output.
# Softmax gives an output between 0 and 1 which can be interpreted as a class probability.
model.add(layers.Dense(100, activation='softmax'))


# Train model
# This creates an Adam optimizer using the default learning rate.
# Default arguments of optimizer:
# Learning rate = 0.001, beta_1 = 0.9, beta_2 = 0.999, epsilon = None,
# Learning rate decay over each update (decay) = 0.0, amsgrad = False
adam = tf.train.AdamOptimizer()
# Before training the model, the learning process has to be configured, which is done via the compile().
# This receives three arguments: optimizer, loss function, and list of metrics
# Adam is used to optimize the loss function
# Loss function is calculated using cross-entropy.
# This evaluates the cross-entropy of the predicted output and the true label.
model.compile(loss='categorical_crossentropy',
              optimizer=adam,
              metrics=['top_k_categorical_accuracy'])
print(model.summary())


# Training
# Train the model on a dataset for 5 epochs and 256 batches with 10% validation split
# batch_size represents the number of dataset elements we apply at the model at a time.
# Epochs represent how many times we iterate over the current batch NOT the whole dataset
# Fit the model
model.fit(x=x_train, y=y_train, validation_split=0.1, batch_size=256, verbose=2, epochs=5)


# Testing
# Evaluate on unseen data
score = model.evaluate(x_test, y_test, verbose=0)
print('Test accuracy: {:0.2f}%'.format(score[1] * 100))


# Inference
idx = randint(0, len(x_test))
img = x_test[idx]
plt.imshow(img.squeeze())
pred = model.predict(np.expand_dims(img, axis=0))[0]
ind = (-pred).argsort()[:5]
latex = [class_names[x] for x in ind]
print(latex)


# Store the classes
# with open('class_names.txt', 'w') as file_handler:
#     for item in class_names:
#         file_handler.write("{}\n".format(item))


# Prepare the model for web format
# Save the model so we can convert it
model.save('keras.h5')


# Import tensorflowjs for conversion
import tensorflowjs as tfjs
tfjs_target_dir = './'

# Convert the model
tfjs.converters.save_keras_model(model, tfjs_target_dir)