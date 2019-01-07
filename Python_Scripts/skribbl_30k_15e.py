# Imports
import os
import glob
import numpy as np
from tensorflow import keras
import tensorflow.keras.layers as layers
import tensorflow as tf


import urllib.request
import matplotlib.pyplot as plt
from random import randint


# change calues only here
__max_item_per_class__ = 30000
__epoch__ = 15


# Download the dataset
def download():
    base = 'https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/'
    for c in classes:
        cls_url = c.replace('_', '%20')
        path = base+cls_url+'.npy'
        print(path)
        urllib.request.urlretrieve(path, './data/'+c+'.npy')


# Load the data
# root = directory of npy files
# vfold_ratio = percentage of validation data
# max_items_per_class = number of training data + validation data
def load_data(root, vfold_ratio=0.2, max_items_per_class=__max_item_per_class__):
    all_files = glob.glob(os.path.join(root, '*.npy'))

    # Initialize variables
    x = np.empty([0, 784])
    y = np.empty([0])
    class_names = []

    # Load each data file
    for idx, file in enumerate(all_files):
        # print("reading file: ", idx, " ", file)
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

    # x_test = image data for validation set
    # y_test = label of image for validation set
    x_test = x[0:vfold_size, :]
    y_test = y[0:vfold_size]

    # x_train = image data for training set
    # y_train = label of image for training set
    x_train = x[vfold_size:x.shape[0], :]
    y_train = y[vfold_size:y.shape[0]]
    return x_train, y_train, x_test, y_test, class_names


# Read class names
# f = open("skribbl_classes.txt", "r")
f = open("mini_classes.txt", "r")
classes = f.readlines()
f.close()

classes = [c.replace('\n', '').replace(' ', '_') for c in classes]


# Download the class files
# download()


# Read in the data
x_train, y_train, x_test, y_test, class_names = load_data('data')
num_classes = len(class_names)
image_size = 28

# print(len(x_train))

idx = randint(0, len(x_train))
# plt.imshow(x_train[idx].reshape(28, 28))
# print(class_names[int(y_train[idx].item())])


# Preprocess the data to prepare it for training
# Reshape and normalize
x_train = x_train.reshape(x_train.shape[0], image_size, image_size, 1).astype('float32')
x_test = x_test.reshape(x_test.shape[0], image_size, image_size, 1).astype('float32')

x_train /= 255.0
x_test /= 255.0


# Convert class vectors to class matrices
# to_categorical has to be used if we are going to apply categorical cross-entropy
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
#adam = tf.train.AdamOptimizer()
adam = tf.keras.optimizers.Adam()  # use a keras optimizer to prevent the warning during saving the model

# Before training the model, the learning process has to be configured, which is done via the compile().
# This receives three arguments: optimizer, loss, and metrics
# Optimizers specifies the training procedure
# optimizer = We used the Adam algorithm to optimize the loss function
# Loss = has to be minimized during optimization
# loss = We calculated this using categorical cross-entropy. This configures the model for categorical classification.
# This evaluates the cross-entropy of the predicted output and the true label.
# Metric is used to judge the performance of the model or to monitor training
model.compile(loss='categorical_crossentropy',
              optimizer=adam,
              metrics=['top_k_categorical_accuracy'])
# model.compile(loss='categorical_crossentropy',
#               optimizer=adam,
#               metrics=['accuracy'])

# This prints a summary representation of the model.
print(model.summary())


# Training
# Train the model on a dataset for 5 epochs and 256 batches with 10% validation split
# x = image data
# y = labels
# validation_split = fraction of images reserved for validation (between 0 and 1)
# validation_split = the validation data used will be the last 10% of the data and is never shuffled
# batch_size = number of dataset elements we apply at the model at a time.
# The model slices the data into smaller batches and iterates over these batches during training.
# epochs = how many times we iterate over the current batch NOT the whole dataset
# epoch = one iteration over the entire input data, which is done in smaller batches
# Fit the model
history = model.fit(x=x_train, y=y_train, validation_split=0.1, batch_size=256, verbose=2, epochs=__epoch__)


# https://machinelearningmastery.com/display-deep-learning-model-training-history-in-keras/
# list all data in history
print(history.history.keys())
# for compile with 'accuracy'
# summarize history for accuracy
# plt.plot(history.history['acc'])
# plt.plot(history.history['val_acc'])
# plt.title('model accuracy')
# plt.ylabel('accuracy')
# plt.xlabel('epoch')
# plt.legend(['train', 'test'], loc='upper left')
# # plt.show()
# plt.savefig('acc.png')
# plt.close()
# # summarize history for loss
# plt.plot(history.history['loss'])
# plt.plot(history.history['val_loss'])
# plt.title('model loss')
# plt.ylabel('loss')
# plt.xlabel('epoch')
# plt.legend(['train', 'test'], loc='upper left')
# plt.savefig('loss.png')
# # plt.show()

# for compile with 'top_k_categorical_accuracy'
# summarize history for accuracy
plt.plot(history.history['top_k_categorical_accuracy'])
plt.plot(history.history['val_top_k_categorical_accuracy'])
plt.title('model top_k_categorical_accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
# plt.show()
plt.savefig('top_k_cat_acc.png')
plt.close()
# summarize history for loss
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.savefig('loss.png')
# plt.show()


# Testing
# Evaluate on unseen data
score = model.evaluate(x_test, y_test, verbose=2)
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
# The Keras model is saved into a HDF5 file which contains:
# architecture of the model, allowing to recreate the model (.json file)
# weights of the model (shard files)
# training configuration (loss, optimizer)
# state of the optimizer, allowing to resume training exactly where you left off
model.save('keras.h5')


# Import tensorflowjs for conversion
import tensorflowjs as tfjs
tfjs_target_dir = './'

# Convert the model
tfjs.converters.save_keras_model(model, tfjs_target_dir)