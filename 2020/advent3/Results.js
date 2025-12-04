import React, { Component } from "react";
import landscape from "../../assets/landscape.txt";
import "./Results.css";

class Results extends Component {
  state = {
    landscapeText: [],
    treeMarkers: [],
    textLineLength: 0,
    indexLoop: [],
  };

  solveProblem(textFile) {
    fetch(textFile)
      .then((r) => r.text())
      .then((text) => {
        let lineArray = [];
        let treeIndexArray = [];
        text.split("\n").forEach((line) => {
          lineArray.push(line);
          let treeLineIndexes = [];
          for (let i = 0; i < line.length; i++) {
            if (line.split("")[i] === "#") {
              treeLineIndexes.push(i);
            }
          }
          treeIndexArray.push(treeLineIndexes);
        });
        return {
          lineArray: lineArray,
          treeIndexArray: treeIndexArray,
          textLineLength:
            lineArray && lineArray[0] ? lineArray[0].length - 1 : 0,
        };
      })
      .then((fileData) => {
        this.setState(
          {
            landscapeText: fileData.lineArray,
            treeMarkers: fileData.treeIndexArray,
            textLineLength: fileData.textLineLength,
          },
          () => {
            let treeCount = 0;
            let notTreeCount = 0;
            this.createIndexLoop();
            setTimeout(() => {
              console.log(this.state.indexLoop);
              console.log(this.state.textLineLength);
              let j = 0;
              for (let i = 2; i < this.state.landscapeText.length; i += 2) {
                console.log(
                  "\nline: " + i,
                  "index: " +
                    this.state.indexLoop[(i - 1) % this.state.indexLoop.length],
                  "indexloopindex: " + (j % this.state.indexLoop.length),
                );
                if (i === 2) {
                  if (
                    this.state.landscapeText[i].split("")[
                      this.state.indexLoop[j % this.state.indexLoop.length]
                    ] === "#"
                  ) {
                    console.log("#");
                    treeCount++;
                  } else {
                    notTreeCount++;
                    console.log(
                      this.state.landscapeText[i].split("")[
                        this.state.indexLoop[0]
                      ],
                    );
                  }
                } else {
                  if (
                    this.state.landscapeText[i].split("")[
                      this.state.indexLoop[j % this.state.indexLoop.length]
                    ] === "#"
                  ) {
                    treeCount++;
                    console.log("#");
                  } else {
                    console.log(
                      this.state.landscapeText[i].split("")[
                        this.state.indexLoop[j % this.state.indexLoop.length]
                      ],
                    );
                    notTreeCount++;
                  }
                }

                console.log(
                  j +
                    "%" +
                    this.state.indexLoop.length +
                    "=>" +
                    (j % this.state.indexLoop.length),
                );
                console.log(
                  this.state.indexLoop[j % this.state.indexLoop.length],
                );
                j++;
              }
              console.log(
                "treeCount: ",
                treeCount,
                "notTreeCount: ",
                notTreeCount,
              );
            }, 0);
          },
        );
      });
  }

  componentDidMount() {
    this.solveProblem(landscape);
  }

  createIndexLoop = () => {
    let indexLoop = [];
    let startPositionReturnCount = 0;
    let csp = 0; // current slide position
    if (this.state.textLineLength !== 0) {
      while (startPositionReturnCount <= 2) {
        if (csp + 1 < this.state.textLineLength) {
          csp += 1;
        } else if (csp + 1 === this.state.textLineLength) {
          csp = 0;
        } else {
          csp = (csp + 1) % this.state.textLineLength;
        }
        if (csp === 1) {
          startPositionReturnCount++;
        }
        if (startPositionReturnCount < 2) {
          indexLoop.push(csp);
        }
      }
      this.setState({
        indexLoop: indexLoop,
      });
    }
  };

  render() {
    return (
      <div className="resultsContainer" onClick={this.checkSteps}>
        <p></p>
      </div>
    );
  }
}

export default Results;
