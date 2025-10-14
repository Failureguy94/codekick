export const beginnerResources = {
  title: "Beginner Level Resources",
  description: "Start your competitive programming journey with these foundational resources",
  recommendation: "We recommend learning Java from YouTube for a strong foundation",
  youtubeLink: "https://www.youtube.com/results?search_query=java+programming+tutorial",
  sections: [
    {
      title: "Getting Started",
      items: [
        "Learn basic syntax and control structures",
        "Understand variables and data types",
        "Practice simple input/output operations",
        "Solve basic problems on HackerRank and LeetCode",
      ],
    },
  ],
};

export const intermediateResources = {
  title: "Intermediate Level Resources",
  description: "Enhance your skills with STL, algorithms, and problem-solving techniques",
  sections: [
    {
      title: "Standard Template Library (STL)",
      contents: [
        {
          name: "Video Tutorials",
          links: [
            {
              title: "STL Playlist",
              url: "https://www.youtube.com/playlist?list=PLauivoElc3gh3RCiQA82MDI-gJfXQQVnn",
            },
            {
              title: "GeeksforGeeks STL Guide",
              url: "https://www.geeksforgeeks.org/the-c-standard-template-library-stl/",
            },
          ],
        },
        {
          name: "Practice Problems",
          links: [
            { title: "Vector Sort", url: "https://www.hackerrank.com/challenges/vector-sort/problem" },
            { title: "Vector Erase", url: "https://www.hackerrank.com/challenges/vector-erase/problem" },
            { title: "Sets", url: "https://www.hackerrank.com/challenges/cpp-sets/problem" },
            { title: "Maps", url: "https://www.hackerrank.com/challenges/cpp-maps/problem" },
            { title: "Two Sum (LeetCode)", url: "https://leetcode.com/problems/two-sum/description/" },
          ],
        },
      ],
    },
    {
      title: "Binary Search",
      contents: [
        {
          name: "Tutorials",
          links: [
            {
              title: "Binary Search Playlist",
              url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF",
            },
          ],
        },
        {
          name: "Easy Problems",
          links: [
            { title: "Binary Search", url: "https://leetcode.com/problems/binary-search/" },
            { title: "Ceil the Floor", url: "https://www.geeksforgeeks.org/problems/ceil-the-floor2802/1" },
          ],
        },
        {
          name: "Medium Problems",
          links: [
            { title: "Search in Rotated Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
            { title: "Find Peak Element", url: "https://leetcode.com/problems/find-peak-element/description/" },
          ],
        },
      ],
    },
    {
      title: "Prefix Sum",
      contents: [
        {
          name: "Tutorial",
          links: [
            {
              title: "Prefix Sum Video",
              url: "https://www.youtube.com/watch?v=nZe7P674xZo",
            },
          ],
        },
        {
          name: "Easy Problems",
          links: [
            { title: "Single Number", url: "https://leetcode.com/problems/single-number/description/" },
            { title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/description/" },
            { title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/description/" },
          ],
        },
      ],
    },
    {
      title: "Recursion and Backtracking",
      contents: [
        {
          name: "Linked List Backtracking",
          links: [
            { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists" },
            { title: "Remove Elements", url: "https://leetcode.com/problems/remove-linked-list-elements" },
            { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list" },
          ],
        },
        {
          name: "General Backtracking",
          links: [
            { title: "Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number" },
            { title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/description/" },
            { title: "Subsets", url: "https://leetcode.com/problems/subsets-ii/description/" },
            { title: "Permutations", url: "https://leetcode.com/problems/permutations/description/" },
          ],
        },
      ],
    },
  ],
};

export const advancedResources = {
  title: "Advanced Level Resources",
  description: "Master advanced algorithms and tackle the toughest challenges",
  sections: [
    {
      title: "Advanced Recursion and Backtracking",
      contents: [
        {
          name: "Tutorials",
          links: [
            {
              title: "Striver's Recursion Playlist",
              url: "https://youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9&si=BloxomHioLbL9miU",
            },
            {
              title: "Utkarsh Gupta Tutorial",
              url: "https://youtu.be/0UM_J1jE1dg?si=FPasd5Us-6jsLvtb",
            },
          ],
        },
        {
          name: "Hard Problems",
          links: [
            { title: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses/description/" },
            { title: "N-Queens", url: "https://leetcode.com/problems/n-queens/" },
            { title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/" },
          ],
        },
      ],
    },
    {
      title: "Bit Manipulation and Bitmasking",
      contents: [
        {
          name: "Tutorials",
          links: [
            {
              title: "Striver's Bit Manipulation",
              url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rnqh8QsJaHyIX7KUiaPUv7",
            },
            {
              title: "Luv Kumar (Video 59-62)",
              url: "https://www.youtube.com/playlist?list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-",
            },
          ],
        },
        {
          name: "Problems",
          links: [
            { title: "Bitwise AND Range", url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/description/" },
            { title: "Codeforces Problem", url: "https://codeforces.com/problemset/problem/1875/C" },
          ],
        },
      ],
    },
    {
      title: "Sieve Algorithm",
      contents: [
        {
          name: "Problems",
          links: [
            { title: "Sieve Problem 1", url: "https://codeforces.com/problemset/problem/17/A" },
            { title: "Count Primes", url: "https://leetcode.com/problems/count-primes/description/" },
            { title: "Ugly Number II", url: "https://leetcode.com/problems/ugly-number-ii/" },
          ],
        },
      ],
    },
    {
      title: "BFS (Breadth-First Search)",
      contents: [
        {
          name: "Tree Problems",
          links: [
            { title: "Same Tree", url: "https://leetcode.com/problems/same-tree" },
            { title: "Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal" },
          ],
        },
        {
          name: "Advanced Problems",
          links: [
            { title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder" },
            { title: "Remove Invalid Parentheses", url: "https://leetcode.com/problems/remove-invalid-parentheses" },
          ],
        },
      ],
    },
    {
      title: "DFS (Depth-First Search)",
      contents: [
        {
          name: "Problems",
          links: [
            { title: "Path Sum", url: "https://leetcode.com/problems/path-sum" },
            { title: "Path Sum II", url: "https://leetcode.com/problems/path-sum-ii" },
            { title: "Binary Tree Maximum Path", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum" },
            { title: "Surrounded Regions", url: "https://leetcode.com/problems/surrounded-regions" },
          ],
        },
      ],
    },
  ],
};
