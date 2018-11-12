# https://github.com/kradolfer/quickdraw-image-recognition/blob/master/quickdraw_image_recognition.ipynb

from matplotlib import pyplot as plt
import numpy as np

# TensorFlow and tf.keras
import tensorflow as tf
from tensorflow import keras

# opencv to load image files
import cv2

CLASS_CNT = 3
class_names = ['apple', 'angel', 'fish']


# function to plot result of one prediction
# plots the image with the predicted class as label
def plot_image(i, predictions_array, true_label, img):
    predictions_array, true_label, img = predictions_array[i], true_label[i], img[i]
    plt.grid(False)
    plt.xticks([])
    plt.yticks([])

    plt.imshow(img, cmap=plt.cm.binary)

    predicted_label = np.argmax(predictions_array)
    if predicted_label == true_label:
        color = 'blue'
    else:
        color = 'red'

    plt.xlabel("{} {:2.0f}% ({})".format(class_names[predicted_label],
                                         100 * np.max(predictions_array),
                                         class_names[true_label]),
               color=color)


# function to plot result of a prediction as bar plot
def plot_value_array(i, predictions_array, true_label):
    predictions_array, true_label = predictions_array[i], true_label[i]
    plt.grid(False)
    plt.xticks([])
    plt.yticks([])
    thisplot = plt.bar(range(CLASS_CNT), predictions_array, color="#777777")
    plt.ylim([0, 1])
    predicted_label = np.argmax(predictions_array)

    thisplot[predicted_label].set_color('red')
    thisplot[true_label].set_color('blue')


def plot_samples(input_array, rows=4, cols=5, title=''):
    '''
     Function to plot 28x28 pixel drawings that are stored in a numpy array.
    Specify how many rows and cols of pictures to display (default 4x5).
    If the array contains less images than subplots selected, surplus subplots remain empty.

    :param input_array:
    :param rows:
    :param cols:
    :param title:
    :return:
    '''

    fig, ax = plt.subplots(figsize=(cols, rows))
    ax.axis('off')
    plt.title(title)

    for i in list(range(0, min(len(input_array), (rows * cols)))):
        a = fig.add_subplot(rows, cols, i + 1)
        imgplot = plt.imshow(input_array[i, :784].reshape((28, 28)), cmap='gray_r', interpolation='nearest')
        plt.xticks([])
        plt.yticks([])


# load sample date from quickdraw data set
# using *npy files
# https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/numpy_bitmap/?pli=1
apple_file = np.load('full_numpy_bitmap_apple.npy')
angel_file = np.load('full_numpy_bitmap_angel.npy')
fish_file = np.load('full_numpy_bitmap_fish.npy')

# add a column with labels, 0=apple, 1=angel, 2=fish
class_0 = np.c_[apple_file, np.zeros(len(apple_file))]
class_1 = np.c_[angel_file, np.ones(len(angel_file))]
class_2 = np.c_[fish_file, np.full(len(fish_file), 2)]

# merge the apple, angel and fish arrays, and split the features/pixels of image (X) and labels (y).
# Convert to float32 to save some memory.
# Reshape to have 28x28
end_index_train = 80000
train_images = np.concatenate((class_0[0:end_index_train, :-1], class_1[0:end_index_train, :-1], class_2[0:end_index_train, :-1]),
                              axis=0).astype('float32').reshape(-1, 28, 28)  # all columns except the last
train_labels = np.concatenate((class_0[:end_index_train, -1], class_1[:end_index_train, -1], class_2[:end_index_train, -1]),
                              axis=0).astype('int')  # the last column

# merge the apple, angel and fish arrays, and split the features (X) and labels (y).
# Convert to float32 to save some memory.
# reshape to have 28x28
end_index_test = end_index_train + 3000
test_images = np.concatenate((class_0[end_index_train:end_index_test, :-1], class_1[end_index_train:end_index_test, :-1],
                              class_2[end_index_train:end_index_test, :-1]), axis=0).astype('float32').reshape(-1, 28, 28)  # all columns except the last
test_labels = np.concatenate((class_0[end_index_train:end_index_test, -1], class_1[end_index_train:end_index_test, -1],
                              class_2[end_index_train:end_index_test, -1]), axis=0).astype('int')  # the last column

# building our model
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),  # this transforms the 2d image input to 1d array
    keras.layers.Dense(30, activation=tf.nn.relu), # 30 nodes in hidden layer
    keras.layers.Dense(3, activation=tf.nn.softmax) # 3 output nodes, 1 output node per class
])

# create keras optimizer, because we can save this one
rms_optimizer = keras.optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
# compile the model before we can train it
model.compile(optimizer=rms_optimizer,  # tf.train.AdamOptimizer(),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# let's train the model now
model.fit(train_images, train_labels, shuffle=True, epochs=5)

# now let's see how good our model got trained - evaluation
test_loss, test_acc = model.evaluate(test_images, test_labels)
print('Test accuracy:', test_acc)

# make some prediction
end_index_prediction = end_index_test + 5
predict_images = np.concatenate((class_0[end_index_test:end_index_prediction, :-1],
                                 class_1[end_index_test:end_index_prediction, :-1],
                                 class_2[end_index_test:end_index_prediction, :-1]), axis=0).astype('float32').reshape(-1, 28, 28)
predict_labels = np.concatenate((class_0[end_index_test:end_index_prediction, -1],
                                 class_1[end_index_test:end_index_prediction, -1],
                                 class_2[end_index_test:end_index_prediction, -1]), axis=0).astype('int')
predictions = model.predict(predict_images)

# Plot the first X test images, their predicted label, and the true label
# Color correct predictions in blue, incorrect predictions in red
num_rows = 5
num_cols = 3
num_images = num_rows * num_cols
# plt.figure(figsize=(2*2*num_cols, 2*num_rows))
plt.figure(figsize=(9, 5))
plt.subplots_adjust(left=0.05, right=0.95, top=0.95, bottom=0.05, hspace=0.29)
for i in range(num_images):
    plt.subplot(num_rows, 2 * num_cols, 2 * i + 1)
    plot_image(i, predictions, predict_labels, predict_images)
    plt.subplot(num_rows, 2 * num_cols, 2 * i + 2)
    plot_value_array(i, predictions, predict_labels)

plt.show()

# load image with opencv
test_img = cv2.imread('test_image.png', cv2.IMREAD_GRAYSCALE)
print("load image of size: ", test_img.shape)
# resize image to 28x28
test_img = cv2.resize(test_img, (28, 28))  # , interpolation=cv2.INTER_CUBIC)
print("resized image to: ", test_img.shape)
# invert image, don't know why this is necessary
test_img = cv2.bitwise_not(test_img)
# we need an array of image for input
# so create one of size 1 with loaded image
test_data = np.array([test_img])
print('single test image:', test_images[1].shape)

# get prediction of our loaded image
predictions = model.predict(test_data)
print("Prediction: ", predictions)

# plot result
plt.subplot(1, 2, 1)
plt.grid(False)
plt.xticks([])
plt.yticks([])
plt.imshow(test_data[0], cmap=plt.cm.binary)
plt.subplot(1, 2, 2)
plt.bar(range(3), predictions[0])
plt.xticks([0, 1, 2], class_names)
plt.subplots_adjust(bottom=0.1, right=0.95, top=0.9)
plt.show()
