package com.example.cotrace.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.example.cotrace.R;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Random;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private TextView dateTimeDisplay;
    private Calendar calendar;
    private SimpleDateFormat dateFormat;
    private String date_display;

    private TextView dorm_cases_num, imported_cases_num, community_cases_num,total_cases_num;
    private Integer dorm_num,imp_num,com_num,total_num;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        homeViewModel =
                ViewModelProviders.of(this).get(HomeViewModel.class);
        View root = inflater.inflate(R.layout.fragment_home, container, false);

        //get current date
        TextView date = root.findViewById(R.id.date);
        calendar = Calendar.getInstance();
        dateFormat = new SimpleDateFormat("dd/MMM");
        date_display = dateFormat.format(calendar.getTime());
        date.setText(date_display);

        //cases number
        int [] totalCases = {18};
        int [] dormCases = {13};
        int [] comCases = {1};
        TextView dorm_cases_num = root.findViewById(R.id.dorm_cases_num);
        TextView imported_cases_num = root.findViewById(R.id.imported_cases_num);
        TextView community_cases_num = root.findViewById(R.id.community_cases_num);
        TextView total_cases_num = root.findViewById(R.id.total_cases_num);

        Random generator = new Random();
        int randomIndex = generator.nextInt(totalCases.length);

        total_num = totalCases[randomIndex];
        total_cases_num.setText(Integer.toString(total_num));
        dorm_num = dormCases[randomIndex];
        dorm_cases_num.setText(Integer.toString(dorm_num));
        com_num = comCases[randomIndex];
        community_cases_num.setText(Integer.toString(com_num));
        imp_num = total_num - dorm_num - com_num;
        imported_cases_num.setText(Integer.toString(imp_num));


//        final TextView textView = root.findViewById(R.id.text_home);

//        homeViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
//            @Override
//            public void onChanged(@Nullable String s) {
////                textView.setText(s);
//            }
//        });
        return root;
    }
}