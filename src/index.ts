// The ClockApp class manages the creation and interaction of clocks displayed on the page
class ClockApp {

  constructor(timezone: string) {
    // Select the necessary DOM elements

    // Retrieving the container element that will hold the clocks
    const clockContainer = document.getElementById('clockContainer') as HTMLDivElement;

    // Create a container element for the clock
    const clockElement = document.createElement('div');
    clockElement.className = 'clock';

    // Create an element to display the time
    const timeDisplay = document.createElement('h1');
    timeDisplay.className = 'time-display';

    // Create buttons for different clock functionalities
    const modeButton = document.createElement('button');
    const increaseButton = document.createElement('button');
    const lightButton = document.createElement('button');
    const resetButton = document.createElement('button');
    const formatButton = document.createElement('button');

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
    const timeZoneOffset = parseInt(timezone.replace('GMT', '')) * 60;
    let currentTime = new Date();
    let adjustedTime = new Date(currentTime.getTime() + timeZoneOffset * 60 * 1000);
    let hours = adjustedTime.getHours();
    let minutes = adjustedTime.getMinutes();
    const millisecondsUntilNextMinute = (60 - adjustedTime.getSeconds()) * 1000;
    let use24HourFormat = true;
    let editable = 0;
    let scale = 1;
    let isLightOn = false;
    let rotationDegrees = 0;

    // Increment adjustedTime by 1 minute, update hours, minutes
    function incrementAdjustedTime() {
      adjustedTime = new Date(adjustedTime.getTime() + 60 * 1000);
      hours = adjustedTime.getHours();
      minutes = adjustedTime.getMinutes();
      updateTime();
    }

    // Update the displayed time based on the current hours and minutes
    function updateTime() {
      const formattedHours = hours < 10 ? '0' + hours : hours.toString();
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
      timeDisplay.textContent = `${formattedHours}:${formattedMinutes}`;
    }

    // Update the displayed time with formatted hours, minutes, and AM/PM if applicable
    function updateFormattedTime() {
      const formattedHours = use24HourFormat ? (hours < 10 ? '0' + hours : hours.toString()) : ((hours % 12 === 0 ? 12 : hours % 12) + '');
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
      const amPm = use24HourFormat ? '' : (hours >= 12 ? 'PM' : 'AM');
      timeDisplay.textContent = `${formattedHours}:${formattedMinutes} ${amPm}`;
    }

    // Scale the clock element by a specified factor
    function scaleClock(factor: number) {
      scale *= factor;
      clockElement.style.transform = `scale(${scale})`;
    }

    // Rotate the clock element by 6 degrees
    function rotateClock() {
      rotationDegrees += 6;
      clockElement.style.transform = `rotate(${rotationDegrees}deg)`;
    }

    // Function to rotate a clock element around a custom pivot point
    function rotateClockCustomPivot(clockElement: HTMLElement, pivotX: number, pivotY: number, angle: number) {
      // Calculate the current position of the clock element
      const clockX = parseFloat(clockElement.style.left || '0');
      const clockY = parseFloat(clockElement.style.top || '0');

      // Calculate the new rotated position using trigonometric transformations
      const rotatedX = pivotX + (clockX - pivotX) * Math.cos(angle) - (clockY - pivotY) * Math.sin(angle);
      const rotatedY = pivotY + (clockX - pivotX) * Math.sin(angle) + (clockY - pivotY) * Math.cos(angle);

      // Update the position of the clock element with the new coordinates
      clockElement.style.left = rotatedX + 'px';
      clockElement.style.top = rotatedY + 'px';
    }

    // Add an event listener to the formatButton to toggle between 12-hour and 24-hour formats
    formatButton.addEventListener('click', () => {
      use24HourFormat = !use24HourFormat;
      updateFormattedTime();
    });

    // Add an event listener to the modeButton for toggling clock modes
    modeButton.addEventListener('click', () => {
      editable = (editable + 1) % 3;
      if (editable === 0) {
        increaseButton.disabled = true;
      } else {
        increaseButton.disabled = false;
      }
    });

    // Add an event listener to the increaseButton for adjusting time and clock size
    increaseButton.addEventListener('click', () => {
      if (editable === 1) {
        hours = (hours + 1) % 24;
      } else if (editable === 2) {
        minutes = (minutes + 1) % 60;
      }
      adjustedTime.setHours(hours);
      adjustedTime.setMinutes(minutes);
      updateTime();
      scaleClock(1.1); // Scale up by 10%
    });

    // Add an event listener to the lightButton for toggling the light on the clock
    lightButton.addEventListener('click', () => {
      isLightOn = !isLightOn;
      if (isLightOn) {
        clockElement.classList.add('light-on');
      } else {
        clockElement.classList.remove('light-on');
      }
    });

    // Add an event listener to the resetButton for resetting the clock to current time
    resetButton.addEventListener('click', () => {
      currentTime = new Date();
      currentTime = new Date(currentTime.getTime() + timeZoneOffset * 60 * 1000);
      hours = currentTime.getHours();
      minutes = currentTime.getMinutes();
      updateTime();
    });

    // Run the code when the DOM content has been loaded
    document.addEventListener('DOMContentLoaded', () => {
      // Make sure to have an element in your HTML with the corresponding ID
      const userDefinedPivotButton = document.getElementById('userDefinedPivotButton') as HTMLButtonElement;

      // Add an event listener to the userDefinedPivotButton
      userDefinedPivotButton.addEventListener('click', () => {
        const userPivotX = 100;
        const userPivotY = 100;
        const rotationAngle = Math.PI / 6;

        // Select all clock elements with the class 'clock'
        const allClocks = document.querySelectorAll('.clock');

        // Rotate each clock element using the user-defined pivot point and angle
        allClocks.forEach(clock => {
          rotateClockCustomPivot(clock as HTMLElement, userPivotX, userPivotY, rotationAngle);
        });
      });
    });

    // Set up a delayed interval to start at the next minute
    setTimeout(() => {
      // Call the function again to sync with the next minute
      incrementAdjustedTime();

      // Set up a repeating interval to update the clock every minute
      setInterval(incrementAdjustedTime, 60000);
    }, millisecondsUntilNextMinute);

    updateTime();
    updateFormattedTime();

    // Set up an interval to rotate the clock element every second
    setInterval(() => {
      rotateClock();
    }, 1000);

    return {
      timeDisplay,
      modeButton,
      increaseButton,
      lightButton,
      resetButton
    };
  }
}

// Initialize clocks with different timezones when the page loads
const clock1 = new ClockApp('GMT+0');
const clock2 = new ClockApp('GMT+1');
const clock3 = new ClockApp('GMT+2');

// Retrieving the button element responsible for creating clocks
const createClockButton = document.getElementById('createClockButton') as HTMLButtonElement;

// Function to prompt the user for a timezone input and create a clock accordingly
const promptTimezone = () => {
  const inputRegex = /^GMT[+-]\d+$/;
  const timezone = prompt('Enter a timezone (e.g., GMT+1):');
  if (timezone === null) {
    return;
  }
  if (!inputRegex.test(timezone)) {
    alert("The timezone format is incorrect. Please use the format 'GMT+number'.");
    promptTimezone();
  } else {
    const clock = new ClockApp(timezone);
  }
};

// Add event listener to the "Create Clock" button
createClockButton.addEventListener('click', () => {
  promptTimezone();
});

// The Vector2D class represents a two-dimensional vector in a Cartesian space
class Vector2D {
  constructor(public x: number, public y: number) { }
  // Method to add two vectors and return the result as a new Vector2D
  add = (o: Vector2D) => new Vector2D(this.x + o.x, this.y + o.y);

  // Method to subtract a vector from another and return the result as a new Vector2D
  subtract = (o: Vector2D) => new Vector2D(this.x - o.x, this.y - o.y);

  // Method to calculate the magnitude (length) of the vector
  magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);

  // Method to normalize the vector (convert it to a unit vector)
  normalize = () => this.magnitude() !== 0 ? new Vector2D(this.x / this.magnitude(), this.y / this.magnitude()) : this;

  // Method to calculate the dot product between two vectors
  dot = (o: Vector2D) => this.x * o.x + this.y * o.y;

  // Method to represent the vector as a string in the format "(x, y)"
  toString = () => `(${this.x}, ${this.y})`;
}

// The Matrix3x3 class represents a 3x3 matrix and provides operations for transformations
class Matrix3x3 {
  private data: number[][];

  // Constructor to initialize the matrix with the provided data.
  constructor(data: number[][]) {
    if (data.length !== 3 || data.some(row => row.length !== 3)) {
      throw new Error("Matrix must be 3x3");
    }
    this.data = data;
  }

  // Calculate the determinant of a 2x2 submatrix
  private determinant2x2(a: number, b: number, c: number, d: number): number {
    return a * d - b * c;
  }

  // Calculate the determinant of a 3x3 matrix
  private determinant(): number {
    const [a, b, c] = this.data[0];
    const [d, e, f] = this.data[1];
    const [g, h, i] = this.data[2];
    return a * this.determinant2x2(e, f, h, i) -
      b * this.determinant2x2(d, f, g, i) +
      c * this.determinant2x2(d, e, g, h);
  }

  // Calculate the inverse of the matrix
  inverse(): Matrix3x3 | null {
    const det = this.determinant();
    if (det === 0) {
      return null; // Matrix is not invertible
    }

    const [a, b, c] = this.data[0];
    const [d, e, f] = this.data[1];
    const [g, h, i] = this.data[2];

    const invDet = 1 / det;
    const invData: number[][] = [
      [this.determinant2x2(e, f, h, i) * invDet, this.determinant2x2(c, b, i, h) * invDet, this.determinant2x2(b, c, e, f) * invDet],
      [this.determinant2x2(f, d, i, g) * invDet, this.determinant2x2(a, c, g, i) * invDet, this.determinant2x2(c, a, d, f) * invDet],
      [this.determinant2x2(d, e, g, h) * invDet, this.determinant2x2(b, a, h, g) * invDet, this.determinant2x2(a, b, d, e) * invDet]
    ];

    return new Matrix3x3(invData);
  }

  // Multiply this matrix by another matrix
  multiply(other: Matrix3x3): Matrix3x3 {
    const resultData: number[][] = [];

    for (let i = 0; i < 3; i++) {
      resultData[i] = [];
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += this.data[i][k] * other.data[k][j];
        }
        resultData[i][j] = sum;
      }
    }

    return new Matrix3x3(resultData);
  }

  // Transform a Vector2D point using this matrix
  transformVector(vector: Vector2D): Vector2D {
    const [a, b, tx] = this.data[0];
    const [c, d, ty] = this.data[1];

    const x = a * vector.x + b * vector.y + tx;
    const y = c * vector.x + d * vector.y + ty;

    return new Vector2D(x, y);
  }

  // Factory method for creating a translation matrix
  static translation(tx: number, ty: number): Matrix3x3 {
    return new Matrix3x3([
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1]
    ]);
  }

  // Factory method for creating a rotation matrix
  static rotation(angle: number): Matrix3x3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Matrix3x3([
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ]);
  }

  // Factory method for creating a scaling matrix
  static scaling(sx: number, sy: number): Matrix3x3 {
    return new Matrix3x3([
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1]
    ]);
  }
}


