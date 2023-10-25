import java.util.HashMap;
import java.util.Map;

public class Main_1 {
    public static void main(String[] args) {
        System.out.println(romanToInt("IX"));
    }

    public static int romanToInt(String s) {
        Map<Character, Integer> romanValue = new HashMap<>();
        romanValue.put('I', 1);
        romanValue.put('V', 5);
        romanValue.put('X', 10);
        romanValue.put('L', 50);
        romanValue.put('C', 100);
        romanValue.put('D', 500);
        romanValue.put('M', 1000);

        int totalValue = 0;
        for (int i = 0; i < s.length(); i++) {
            if (i > 0 && romanValue.get(s.charAt(i)) > romanValue.get(s.charAt(i - 1))) {
                totalValue += romanValue.get(s.charAt(i)) - 2 * romanValue.get(s.charAt(i - 1));
            } else {
                totalValue += romanValue.get(s.charAt(i));
            }
        }
        return totalValue;
    }
}