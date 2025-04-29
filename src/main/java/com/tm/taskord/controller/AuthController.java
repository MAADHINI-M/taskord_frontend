// package com.tm.taskord.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestParam;

// import com.tm.taskord.service.AuthService;
// import com.tm.taskord.service.UserService;

// @Controller
// public class AuthController {

//     @Autowired
//     private AuthService authService;

//     @Autowired
//     private UserService userService;

//     @GetMapping("/login")
//     public String loginPage() {
//         return "login";
//     }
//     @GetMapping("/")
//     public String loginPagxe() {
//         return "login";
//     }

//     @PostMapping("/login")
//     public String login(@RequestParam String username, @RequestParam String password, Model model) {
//         try {
//             System.out.println(username);
//             System.out.println(password);
//             String token = authService.login(username, password);
//             System.out.println(token);
//             model.addAttribute("token", token);
//             return "redirect:/dashboard";
//         } catch (Exception e) {
//             model.addAttribute("error", "Invalid credentials");
//             return "login";
//         }
//     }

//     @GetMapping("/signup")
//     public String signupPage() {
//         return "signup";
//     }

//     @PostMapping("/signup")
//     public String signup(@RequestParam String username, @RequestParam String password, @RequestParam String role, Model model) {
//         try {
//             userService.createUser(username, password, role);
//             return "redirect:/login";
//         } catch (IllegalArgumentException e) {
//             model.addAttribute("error", e.getMessage());
//             return "signup";
//         }
//     }

//     @GetMapping("/dashboard")
//     public String dashboard(Authentication authentication, Model model) {
//         String role = authentication.getAuthorities().iterator().next().getAuthority();
//         model.addAttribute("username", authentication.getName());
//         model.addAttribute("role", role);
//         return "dashboard";
//     }
// }

package com.tm.taskord.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tm.taskord.service.UserService;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/")
    public String homePage() {
        return "redirect:/login";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/signup")
    public String signup(@RequestParam String username, @RequestParam String password, @RequestParam String role, Model model) {
        try {
            userService.createUser(username, password, role);
            return "redirect:/login";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "signup";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        model.addAttribute("username", authentication.getName());
        model.addAttribute("role", role);
        return "dashboard";
    }
}
