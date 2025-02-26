This is a script for finding the best way to organize groups of discs into a binder.

# Instructions
1. Update the `groups.json` file to have a list of groups, in my case I used franchises, with their name and the number of discs in that group.
2. Update the `PAGE_SIZE` variable on line 5 of `index.js` to match the number of discs per page in your binder. (Defaults to 8)
3. Run `node index.js`
4. Check `output.txt` for the results

# Groups Example
```
{
    "groups": [
        {
            "name": "Star Wars",
            "count": 10
        }
    ]
}
```