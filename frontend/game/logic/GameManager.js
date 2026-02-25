export class GameManager {
    constructor(character, levelManager, input) {
        this.character = character;
        this.levelManager = levelManager;
        this.input = input;

        this._lastTurn = "CENTER";

        this.gameState = "RUNNING";
        this.junctionDismissed = false;

        // Tracks how many junctions have been reached.
        // The FIRST junction (junctionCount === 0) requires a hand-raise gesture
        // or the H key to dismiss the dialogue overlay before turning.
        // All subsequent junctions (junctionCount >= 1) are auto-dismissed —
        // no gesture or keybinding is needed; just turn.
        this.junctionCount = 0;

        this.lives = 3;
        this.score = 0;
    }

    update() {
        const speed = this.character.animator.speed;
        const turn = this.input.turn;

        switch (this.gameState) {

            case "RUNNING": {
                this.levelManager.update(speed);
                if (this.levelManager.isBlocked) {
                    this.gameState = "AT_JUNCTION";
                }
                break;
            }

            case "AT_JUNCTION": {
                // Junction 1 (junctionCount === 0): require a hand-raise (gesture or H key)
                // to dismiss the dialogue overlay before the player can turn.
                // Junction 2+ (junctionCount >= 1): auto-dismiss — just turn directly.
                if (!this.junctionDismissed) {
                    if (this.junctionCount > 0) {
                        // Not the first junction — skip the gesture gate entirely.
                        this.junctionDismissed = true;
                    } else if (this.input.l_arm > 60 || this.input.r_arm > 60) {
                        // First junction — wait for either arm to be raised.
                        this.junctionDismissed = true;
                    }
                } else {
                    if (turn !== "CENTER" && turn !== this._lastTurn) {
                        this.levelManager.handleTurn(turn, this.character.group);
                        this.junctionDismissed = false;
                        this.junctionCount++;           // Increment after each successful turn
                        this._lastTurn = "CENTER";      // Reset so same direction works next junction
                        this.gameState = "RUNNING";
                    }
                }
                this._lastTurn = turn;
                break;
            }

            case "AT_DOOR": {
                break;
            }

            case "DEAD": {
                break;
            }
        }
    }

    loseLife() {
        this.lives -= 1;
        console.log("💔 Life lost! Remaining lives:", this.lives);

        if (this.lives < 0) {
            this.gameState = "DEAD";
            console.log("💀 Game Over — no lives remaining.");
        } else {
            this.character.group.rotation.set(0, 0, 0);
            this.levelManager.resetToStart();
            this.gameState = "RUNNING";
        }
    }
}
