# Hangman

## Overview

Hangman game made with vanilla html, css and javascript.

## Objective

The aim of this project was to practice using the document object model. I dynamically generated some elements and used event listeners to alter the state of the game such as switching between game screens or changing the game mode (functionality) of the game dynamically.

## Links

[Live Game](https://solo-incrementing.github.io/hangman/)

## The Game

### Core Game

- The core game involves guessing letters for a word to figure out what the word is. Guessing correctly reveals the letter and guessing incorrectly incurs a "strike" denoted by the part of a stick man doodle being drawn. If the word is not guessed before 10 strikes, the player's score is reset.

### Game Modes

- The game has two game modes, a normal mode and a hardcore mode. For the normal mode, the words are selected from a chosen category. For the hardcore mode, the words are pulled from a dictionary of more than 10,000 words which are unrelated.

### Score System

- The player gains a point for every correct letter and loses a point for every incorrect letter (Subject to change)

## Technologies

- HTML5
- CSS3
- Javascript
