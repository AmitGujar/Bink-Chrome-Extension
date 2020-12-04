# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.
  
## Development Setup
1. Clone the repository to your machine : `git clone https://github.com/AmitGujar/Bink-Chrome-Extension`
2. Enable Extensions Developer Mode on Google Chrome/Microsoft Edge.
3. Navigate to [chrome://extensions/](chrome://extensions/) or [edge://extensions](edge://extensions/).
4. Enable developer mode (Toggle button in right top corner).
5. Select `Load Unpacked` and browse and select the cloned repository folder.
6. Make sure that the extension is enabled.
7. Open a new tab in Chrome and you should see a splash screen with motivational quotes.
8. Microsoft Edge disables all-new tab extensions by default so, make sure to enable it manually from the extensions section.

## Pull Request Process

1. Ensure your code compiles. Run `make` before creating the pull request.
2. If you're adding new external API, it must be properly documented.
3. The commit message is formatted as follows:

```
   component: <summary>

   A paragraph explaining the problem and its context.

   Another one explaining how you solved that.

   <link to the bug ticket>
```

4. You may merge the pull request in once you have the sign-off of the maintainers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Issue tags
* "Bug": Something that should work is broken
* "Enhancement": AKA feature request - adds new functionality
* "Hacktoberfest": Part of hacktoberfest program
* "Task": Something that needs to be done that doesn't really fix anything or add major functionality. Tests, engineering, documentation, etc.
