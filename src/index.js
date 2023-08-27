// The ClockApp class manages the creation and interaction of clocks displayed on the page
var ClockApp = /** @class */ (function () {
    function ClockApp(timezone) {
        // Select the necessary DOM elements
        // Retrieving the container element that will hold the clocks
        var clockContainer = document.getElementById('clockContainer');
        // Create a container element for the clock
        var clockElement = document.createElement('div');
        clockElement.className = 'clock';
        // Create an element to display the time
        var timeDisplay = document.createElement('h1');
        timeDisplay.className = 'time-display';
        // Create buttons for different clock functionalities
        var modeButton = document.createElement('button');
        var increaseButton = document.createElement('button');
        var lightButton = document.createElement('button');
        var resetButton = document.createElement('button');
        var formatButton = document.createElement('button');
        // Set labels for the buttons
        modeButton.textContent = 'Mode';
        increaseButton.textContent = 'Increase';
        lightButton.textContent = 'Light';
        resetButton.textContent = 'Reset';
        formatButton.textContent = 'Toggle Format';
        // Append elements to the clock container
        clockElement.appendChild(timeDisplay);
        clockElement.appendChild(modeButton);
        clockElement.appendChild(increaseButton);
        clockElement.appendChild(lightButton);
        clockElement.appendChild(resetButton);
        clockElement.appendChild(formatButton);
        // Add the clock container to the main clock container in the DOM
        clockContainer.appendChild(clockElement);
        // Initial variable setup for clock functionality
        var timeZoneOffset = parseInt(timezone.replace('GMT', '')) * 60;
        var currentTime = new Date();
        var adjustedTime = new Date(currentTime.getTime() + timeZoneOffset * 60 * 1000);
        var hours = adjustedTime.getHours();
        var minutes = adjustedTime.getMinutes();
        var millisecondsUntilNextMinute = (60 - adjustedTime.getSeconds()) * 1000;
        var use24HourFormat = true;
        var editable = 0;
        var scale = 1;
        var isLightOn = false;
        var rotationDegrees = 0;
        // Increment adjustedTime by 1 minute, update hours, minutes
        function incrementAdjustedTime() {
            adjustedTime = new Date(adjustedTime.getTime() + 60 * 1000);
            hours = adjustedTime.getHours();
            minutes = adjustedTime.getMinutes();
            updateTime();
        }
        // Update the displayed time based on the current hours and minutes
        function updateTime() {
            var formattedHours = hours < 10 ? '0' + hours : hours.toString();
            var formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
            timeDisplay.textContent = "".concat(formattedHours, ":").concat(formattedMinutes);
        }
        // Update the displayed time with formatted hours, minutes, and AM/PM if applicable
        function updateFormattedTime() {
            var formattedHours = use24HourFormat ? (hours < 10 ? '0' + hours : hours.toString()) : ((hours % 12 === 0 ? 12 : hours % 12) + '');
            var formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
            var amPm = use24HourFormat ? '' : (hours >= 12 ? 'PM' : 'AM');
            timeDisplay.textContent = "".concat(formattedHours, ":").concat(formattedMinutes, " ").concat(amPm);
        }
        // Scale the clock element by a specified factor
        function scaleClock(factor) {
            scale *= factor;
            clockElement.style.transform = "scale(".concat(scale, ")");
        }
        // Rotate the clock element by 6 degrees
        function rotateClock() {
            rotationDegrees += 6;
            clockElement.style.transform = "rotate(".concat(rotationDegrees, "deg)");
        }
        // Function to rotate a clock element around a custom pivot point
        function rotateClockCustomPivot(clockElement, pivotX, pivotY, angle) {
            // Calculate the current position of the clock element
            var clockX = parseFloat(clockElement.style.left || '0');
            var clockY = parseFloat(clockElement.style.top || '0');
            // Calculate the new rotated position using trigonometric transformations
            var rotatedX = pivotX + (clockX - pivotX) * Math.cos(angle) - (clockY - pivotY) * Math.sin(angle);
            var rotatedY = pivotY + (clockX - pivotX) * Math.sin(angle) + (clockY - pivotY) * Math.cos(angle);
            // Update the position of the clock element with the new coordinates
            clockElement.style.left = rotatedX + 'px';
            clockElement.style.top = rotatedY + 'px';
        }
        // Add an event listener to the formatButton to toggle between 12-hour and 24-hour formats
        formatButton.addEventListener('click', function () {
            use24HourFormat = !use24HourFormat;
            updateFormattedTime();
        });
        // Add an event listener to the modeButton for toggling clock modes
        modeButton.addEventListener('click', function () {
            editable = (editable + 1) % 3;
            if (editable === 0) {
                increaseButton.disabled = true;
            }
            else {
                increaseButton.disabled = false;
            }
        });
        // Add an event listener to the increaseButton for adjusting time and clock size
        increaseButton.addEventListener('click', function () {
            if (editable === 1) {
                hours = (hours + 1) % 24;
            }
            else if (editable === 2) {
                minutes = (minutes + 1) % 60;
            }
            adjustedTime.setHours(hours);
            adjustedTime.setMinutes(minutes);
            updateTime();
            scaleClock(1.1); // Scale up by 10%
        });
        // Add an event listener to the lightButton for toggling the light on the clock
        lightButton.addEventListener('click', function () {
            isLightOn = !isLightOn;
            if (isLightOn) {
                clockElement.classList.add('light-on');
            }
            else {
                clockElement.classList.remove('light-on');
            }
        });
        // Add an event listener to the resetButton for resetting the clock to current time
        resetButton.addEventListener('click', function () {
            currentTime = new Date();
            currentTime = new Date(currentTime.getTime() + timeZoneOffset * 60 * 1000);
            hours = currentTime.getHours();
            minutes = currentTime.getMinutes();
            updateTime();
        });
        // Run the code when the DOM content has been loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Make sure to have an element in your HTML with the corresponding ID
            var userDefinedPivotButton = document.getElementById('userDefinedPivotButton');
            // Add an event listener to the userDefinedPivotButton
            userDefinedPivotButton.addEventListener('click', function () {
                var userPivotX = 100;
                var userPivotY = 100;
                var rotationAngle = Math.PI / 6;
                // Select all clock elements with the class 'clock'
                var allClocks = document.querySelectorAll('.clock');
                // Rotate each clock element using the user-defined pivot point and angle
                allClocks.forEach(function (clock) {
                    rotateClockCustomPivot(clock, userPivotX, userPivotY, rotationAngle);
                });
            });
        });
        // Set up a delayed interval to start at the next minute
        setTimeout(function () {
            // Call the function again to sync with the next minute
            incrementAdjustedTime();
            // Set up a repeating interval to update the clock every minute
            setInterval(incrementAdjustedTime, 60000);
        }, millisecondsUntilNextMinute);
        updateTime();
        updateFormattedTime();
        // Set up an interval to rotate the clock element every second
        setInterval(function () {
            rotateClock();
        }, 1000);
        return {
            timeDisplay: timeDisplay,
            modeButton: modeButton,
            increaseButton: increaseButton,
            lightButton: lightButton,
            resetButton: resetButton
        };
    }
    return ClockApp;
}());
// Initialize clocks with different timezones when the page loads
var clock1 = new ClockApp('GMT+0');
var clock2 = new ClockApp('GMT+1');
var clock3 = new ClockApp('GMT+2');
// Retrieving the button element responsible for creating clocks
var createClockButton = document.getElementById('createClockButton');
// Function to prompt the user for a timezone input and create a clock accordingly
var promptTimezone = function () {
    var inputRegex = /^GMT[+-]\d+$/;
    var timezone = prompt('Enter a timezone (e.g., GMT+1):');
    if (timezone === null) {
        return;
    }
    if (!inputRegex.test(timezone)) {
        alert("The timezone format is incorrect. Please use the format 'GMT+number'.");
        promptTimezone();
    }
    else {
        var clock = new ClockApp(timezone);
    }
};
// Add event listener to the "Create Clock" button
createClockButton.addEventListener('click', function () {
    promptTimezone();
});
// The Vector2D class represents a two-dimensional vector in a Cartesian space
var Vector2D = /** @class */ (function () {
    function Vector2D(x, y) {
        var _this = this;
        this.x = x;
        this.y = y;
        // Method to add two vectors and return the result as a new Vector2D
        this.add = function (o) { return new Vector2D(_this.x + o.x, _this.y + o.y); };
        // Method to subtract a vector from another and return the result as a new Vector2D
        this.subtract = function (o) { return new Vector2D(_this.x - o.x, _this.y - o.y); };
        // Method to calculate the magnitude (length) of the vector
        this.magnitude = function () { return Math.sqrt(_this.x * _this.x + _this.y * _this.y); };
        // Method to normalize the vector (convert it to a unit vector)
        this.normalize = function () { return _this.magnitude() !== 0 ? new Vector2D(_this.x / _this.magnitude(), _this.y / _this.magnitude()) : _this; };
        // Method to calculate the dot product between two vectors
        this.dot = function (o) { return _this.x * o.x + _this.y * o.y; };
        // Method to represent the vector as a string in the format "(x, y)"
        this.toString = function () { return "(".concat(_this.x, ", ").concat(_this.y, ")"); };
    }
    return Vector2D;
}());
// The Matrix3x3 class represents a 3x3 matrix and provides operations for transformations
var Matrix3x3 = /** @class */ (function () {
    // Constructor to initialize the matrix with the provided data.
    function Matrix3x3(data) {
        if (data.length !== 3 || data.some(function (row) { return row.length !== 3; })) {
            throw new Error("Matrix must be 3x3");
        }
        this.data = data;
    }
    // Calculate the determinant of a 2x2 submatrix
    Matrix3x3.prototype.determinant2x2 = function (a, b, c, d) {
        return a * d - b * c;
    };
    // Calculate the determinant of a 3x3 matrix
    Matrix3x3.prototype.determinant = function () {
        var _a = this.data[0], a = _a[0], b = _a[1], c = _a[2];
        var _b = this.data[1], d = _b[0], e = _b[1], f = _b[2];
        var _c = this.data[2], g = _c[0], h = _c[1], i = _c[2];
        return a * this.determinant2x2(e, f, h, i) -
            b * this.determinant2x2(d, f, g, i) +
            c * this.determinant2x2(d, e, g, h);
    };
    // Calculate the inverse of the matrix
    Matrix3x3.prototype.inverse = function () {
        var det = this.determinant();
        if (det === 0) {
            return null; // Matrix is not invertible
        }
        var _a = this.data[0], a = _a[0], b = _a[1], c = _a[2];
        var _b = this.data[1], d = _b[0], e = _b[1], f = _b[2];
        var _c = this.data[2], g = _c[0], h = _c[1], i = _c[2];
        var invDet = 1 / det;
        var invData = [
            [this.determinant2x2(e, f, h, i) * invDet, this.determinant2x2(c, b, i, h) * invDet, this.determinant2x2(b, c, e, f) * invDet],
            [this.determinant2x2(f, d, i, g) * invDet, this.determinant2x2(a, c, g, i) * invDet, this.determinant2x2(c, a, d, f) * invDet],
            [this.determinant2x2(d, e, g, h) * invDet, this.determinant2x2(b, a, h, g) * invDet, this.determinant2x2(a, b, d, e) * invDet]
        ];
        return new Matrix3x3(invData);
    };
    // Multiply this matrix by another matrix
    Matrix3x3.prototype.multiply = function (other) {
        var resultData = [];
        for (var i = 0; i < 3; i++) {
            resultData[i] = [];
            for (var j = 0; j < 3; j++) {
                var sum = 0;
                for (var k = 0; k < 3; k++) {
                    sum += this.data[i][k] * other.data[k][j];
                }
                resultData[i][j] = sum;
            }
        }
        return new Matrix3x3(resultData);
    };
    // Transform a Vector2D point using this matrix
    Matrix3x3.prototype.transformVector = function (vector) {
        var _a = this.data[0], a = _a[0], b = _a[1], tx = _a[2];
        var _b = this.data[1], c = _b[0], d = _b[1], ty = _b[2];
        var x = a * vector.x + b * vector.y + tx;
        var y = c * vector.x + d * vector.y + ty;
        return new Vector2D(x, y);
    };
    // Factory method for creating a translation matrix
    Matrix3x3.translation = function (tx, ty) {
        return new Matrix3x3([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ]);
    };
    // Factory method for creating a rotation matrix
    Matrix3x3.rotation = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return new Matrix3x3([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]
        ]);
    };
    // Factory method for creating a scaling matrix
    Matrix3x3.scaling = function (sx, sy) {
        return new Matrix3x3([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]);
    };
    return Matrix3x3;
}());
