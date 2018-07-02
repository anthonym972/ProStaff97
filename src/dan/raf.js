const requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame;

/**
* Request animation frame manager
*/
const callbacks = []
let requestId = -1,
    lastDraw = -1,
    time,
    dt,
    i

// Animation loop
function animate() {
    // Setup
    time = Date.now()
    dt = Math.min(time - lastDraw, 100) // 10 fps
    // Call next frame
    requestId = requestAnimationFrame(animate)

    // Update
    for (i = 0; i < callbacks.length; i++) {
        callbacks[i](dt)
    }

    // Save
    lastDraw = time
}

/**
 * Start play the raf
 */
function play() {
    if (requestId === -1) {
        lastDraw = Date.now()
        time = lastDraw
        requestId = requestAnimationFrame(animate)
    }
}

/**
 * Stop the raf
 */
function pause() {
    if (requestId !== -1) {
        cancelAnimationFrame(requestId)
        requestId = -1
    }
}

/**
 * Test if the raf is playing
 */
function isPlaying() {
    return requestId !== -1
}

/**
 * Add a new unique callback
 * @param {function} callback - Callback to call each frame
 * @returns {RAF}
 */
function add(callback) {
    if (callbacks.indexOf(callback) === -1) {
        callbacks.push(callback)

        // Play
        if (callbacks.length === 1) {
            play()
        }
    }
}

/**
 * Add a new unique callback to call one time
 * @param {function} callback - Callback to call one time
 */
function addOnce(callback) {
    const ticker = (dt) => {
        remove(ticker)
        callback(dt)
    }
    callbacks.push()
    return add(ticker)
}

/**
 * Remove a callback
 * @param {function} callback - Callback to remove
 */
function remove(callback) {
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
        callbacks.splice(index, 1)

        // Pause
        if (callbacks.length === 0) {
            pause()
        }
    }
}

// Export
export {
    play as playRaf,
    pause as pauseRaf,
    add as addRaf,
    addOnce as addRafOnce,
    remove as removeRaf
}
export default add